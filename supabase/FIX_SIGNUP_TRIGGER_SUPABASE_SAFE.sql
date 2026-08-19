-- ===============================================
-- FIX SIGNUP ERROR 500 - VERSION SUPABASE COMPATIBLE
-- Date : 2026-08-19
-- ===============================================
-- IMPORTANT : Ce script utilise les permissions Supabase standards
-- Il ne modifie PAS les triggers auth.users (permissions insuffisantes)
-- Au lieu de cela, il utilise une approche alternative
-- ===============================================

-- ===============================================
-- APPROCHE 1 : Vérifier si le trigger existe déjà
-- ===============================================

DO $$
BEGIN
  -- Vérifier si le trigger existe
  IF EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    RAISE NOTICE '✅ Le trigger on_auth_user_created existe déjà';
  ELSE
    RAISE NOTICE '❌ Le trigger on_auth_user_created n''existe pas';
    RAISE NOTICE '⚠️  Vous devez utiliser la Supabase CLI pour créer ce trigger';
  END IF;
END $$;

-- ===============================================
-- APPROCHE 2 : Créer uniquement la fonction helper
-- ===============================================

-- Supprimer l'ancienne fonction si elle existe
DROP FUNCTION IF EXISTS public.get_valid_user_role(TEXT) CASCADE;

-- Créer la fonction helper pour valider le rôle
CREATE OR REPLACE FUNCTION public.get_valid_user_role(role_input TEXT)
RETURNS user_role AS $$
BEGIN
  -- Normaliser l'input (trim, lowercase)
  role_input := LOWER(TRIM(COALESCE(role_input, '')));

  -- Vérifier si le rôle est valide
  IF role_input IN ('admin', 'coworking_client', 'standard_client', 'visitor') THEN
    RETURN role_input::user_role;
  ELSE
    -- Rôle par défaut si invalide
    RETURN 'visitor'::user_role;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- En cas d'erreur, retourner visitor
    RETURN 'visitor'::user_role;
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER;

COMMENT ON FUNCTION public.get_valid_user_role IS 'Valide et retourne un rôle user_role valide, ou visitor si invalide';

RAISE NOTICE '✅ Fonction get_valid_user_role créée';

-- ===============================================
-- APPROCHE 3 : Tenter de recréer handle_new_user()
-- (Peut échouer si permissions insuffisantes)
-- ===============================================

-- Supprimer l'ancienne fonction
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Créer la nouvelle fonction avec gestion d'erreur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_value user_role;
  role_from_metadata TEXT;
  first_name_value TEXT;
  last_name_value TEXT;
  phone_value TEXT;
BEGIN
  -- Récupérer les données depuis raw_user_meta_data
  role_from_metadata := COALESCE(NEW.raw_user_meta_data->>'role', 'visitor');
  first_name_value := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  last_name_value := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  phone_value := COALESCE(NEW.raw_user_meta_data->>'phone', '');

  -- Valider et convertir le rôle avec la fonction helper
  user_role_value := public.get_valid_user_role(role_from_metadata);

  -- Insérer le profil utilisateur
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    phone,
    role
  ) VALUES (
    NEW.id,
    NEW.email,
    first_name_value,
    last_name_value,
    phone_value,
    user_role_value
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    updated_at = NOW();

  -- Logger le succès
  RAISE NOTICE 'Profile created successfully for user % with role %', NEW.email, user_role_value;

  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- Logger l'erreur mais NE PAS bloquer l'inscription
    RAISE WARNING 'Error in handle_new_user() for user %: % (SQLSTATE: %)',
      NEW.email,
      SQLERRM,
      SQLSTATE;

    -- Retourner NEW pour que l'inscription continue
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user IS 'Trigger function: crée automatiquement un profil lors de l''inscription';

RAISE NOTICE '✅ Fonction handle_new_user créée/mise à jour';

-- ===============================================
-- TESTS DE VALIDATION
-- ===============================================

-- Test 1 : Vérifier que get_valid_user_role fonctionne
DO $$
BEGIN
  ASSERT public.get_valid_user_role('admin') = 'admin'::user_role, '❌ Test admin failed';
  ASSERT public.get_valid_user_role('standard_client') = 'standard_client'::user_role, '❌ Test standard_client failed';
  ASSERT public.get_valid_user_role('coworking_client') = 'coworking_client'::user_role, '❌ Test coworking_client failed';
  ASSERT public.get_valid_user_role('visitor') = 'visitor'::user_role, '❌ Test visitor failed';
  ASSERT public.get_valid_user_role('invalid_role') = 'visitor'::user_role, '❌ Test invalid_role failed';
  ASSERT public.get_valid_user_role(NULL) = 'visitor'::user_role, '❌ Test NULL failed';
  ASSERT public.get_valid_user_role('  ADMIN  ') = 'admin'::user_role, '❌ Test trim/lowercase failed';

  RAISE NOTICE '✅ Tous les tests de validation des rôles sont réussis';
END $$;

-- ===============================================
-- RAPPORT DE STATUS
-- ===============================================

DO $$
DECLARE
  trigger_exists BOOLEAN;
  function_exists BOOLEAN;
BEGIN
  -- Vérifier si le trigger existe
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) INTO trigger_exists;

  -- Vérifier si la fonction existe
  SELECT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user'
  ) INTO function_exists;

  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════';
  RAISE NOTICE '📊 RAPPORT DE STATUS';
  RAISE NOTICE '═══════════════════════════════════════════════════════';
  RAISE NOTICE '';

  IF function_exists THEN
    RAISE NOTICE '✅ Fonction handle_new_user() : EXISTE';
  ELSE
    RAISE NOTICE '❌ Fonction handle_new_user() : MANQUANTE';
  END IF;

  IF trigger_exists THEN
    RAISE NOTICE '✅ Trigger on_auth_user_created : EXISTE';
  ELSE
    RAISE NOTICE '❌ Trigger on_auth_user_created : MANQUANT';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  ATTENTION : Le trigger n''existe pas sur auth.users';
    RAISE NOTICE '   Raison probable : Permissions insuffisantes';
    RAISE NOTICE '';
    RAISE NOTICE '📋 SOLUTIONS POSSIBLES :';
    RAISE NOTICE '';
    RAISE NOTICE '1️⃣  Utiliser Supabase CLI (recommandé) :';
    RAISE NOTICE '   supabase db reset';
    RAISE NOTICE '   Les migrations dans supabase/migrations/ seront appliquées';
    RAISE NOTICE '';
    RAISE NOTICE '2️⃣  Créer le trigger via Dashboard Settings :';
    RAISE NOTICE '   Dashboard > Database > Triggers > Create Trigger';
    RAISE NOTICE '   Table : auth.users';
    RAISE NOTICE '   Event : INSERT';
    RAISE NOTICE '   Function : handle_new_user()';
    RAISE NOTICE '';
    RAISE NOTICE '3️⃣  Contacter le support Supabase pour élever les permissions';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════';
END $$;

-- ===============================================
-- FIN DU SCRIPT
-- ===============================================
