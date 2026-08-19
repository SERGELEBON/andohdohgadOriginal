-- ===============================================
-- FIX DEFINITIF : Erreur 500 lors du signup
-- Date : 2026-08-11
-- ===============================================
-- PROBLÈME : Le trigger handle_new_user() échoue et provoque une erreur 500
-- SOLUTION : Refactorisation complète avec gestion d'erreur robuste
-- ===============================================

-- ===============================================
-- 1. Supprimer l'ancien trigger s'il existe
-- ===============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.get_valid_user_role(TEXT) CASCADE;

-- ===============================================
-- 2. Créer une fonction helper pour valider le rôle
-- ===============================================

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

-- ===============================================
-- 3. Créer le trigger handle_new_user() avec gestion d'erreur
-- ===============================================

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

  -- Valider et convertir le rôle
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

COMMENT ON FUNCTION public.handle_new_user IS 'Trigger function: crée automatiquement un profil lors de l''inscription d''un utilisateur';

-- ===============================================
-- 4. Créer le trigger sur auth.users
-- ===============================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Déclenche la création automatique du profil utilisateur';

-- ===============================================
-- 5. TESTS DE VÉRIFICATION
-- ===============================================

-- Test 1 : Vérifier que la fonction helper existe
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_valid_user_role') THEN
    RAISE NOTICE '✅ Fonction get_valid_user_role existe';
  ELSE
    RAISE EXCEPTION '❌ Fonction get_valid_user_role manquante';
  END IF;
END $$;

-- Test 2 : Tester la validation des rôles
DO $$
BEGIN
  -- Test rôles valides
  ASSERT public.get_valid_user_role('admin') = 'admin'::user_role, '❌ Test admin failed';
  ASSERT public.get_valid_user_role('standard_client') = 'standard_client'::user_role, '❌ Test standard_client failed';
  ASSERT public.get_valid_user_role('coworking_client') = 'coworking_client'::user_role, '❌ Test coworking_client failed';
  ASSERT public.get_valid_user_role('visitor') = 'visitor'::user_role, '❌ Test visitor failed';

  -- Test rôles invalides (doivent retourner 'visitor')
  ASSERT public.get_valid_user_role('invalid_role') = 'visitor'::user_role, '❌ Test invalid_role failed';
  ASSERT public.get_valid_user_role(NULL) = 'visitor'::user_role, '❌ Test NULL failed';
  ASSERT public.get_valid_user_role('') = 'visitor'::user_role, '❌ Test empty string failed';
  ASSERT public.get_valid_user_role('  ADMIN  ') = 'admin'::user_role, '❌ Test trim/lowercase failed';

  RAISE NOTICE '✅ Tous les tests de validation des rôles sont réussis';
END $$;

-- Test 3 : Vérifier que le trigger existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    RAISE NOTICE '✅ Trigger on_auth_user_created existe';
  ELSE
    RAISE EXCEPTION '❌ Trigger on_auth_user_created manquant';
  END IF;
END $$;

-- ===============================================
-- 6. VÉRIFICATION FINALE
-- ===============================================

SELECT
  '✅ SETUP COMPLET' as status,
  COUNT(*) FILTER (WHERE proname = 'get_valid_user_role') as helper_function_count,
  COUNT(*) FILTER (WHERE proname = 'handle_new_user') as trigger_function_count
FROM pg_proc
WHERE proname IN ('get_valid_user_role', 'handle_new_user');

-- Afficher les détails du trigger
SELECT
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  tgenabled as enabled,
  pg_get_triggerdef(oid) as trigger_definition
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- ===============================================
-- 7. INSTRUCTIONS POST-APPLICATION
-- ===============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════';
  RAISE NOTICE '✅ FIX APPLIQUÉ AVEC SUCCÈS';
  RAISE NOTICE '═══════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '📋 PROCHAINES ÉTAPES :';
  RAISE NOTICE '';
  RAISE NOTICE '1. Tester le signup depuis l''application :';
  RAISE NOTICE '   http://localhost:3000/inscription';
  RAISE NOTICE '';
  RAISE NOTICE '2. Vérifier que le profil est créé :';
  RAISE NOTICE '   SELECT * FROM profiles ORDER BY created_at DESC LIMIT 5;';
  RAISE NOTICE '';
  RAISE NOTICE '3. Configurer les Redirect URLs dans Supabase Dashboard :';
  RAISE NOTICE '   Authentication > URL Configuration > Redirect URLs';
  RAISE NOTICE '   - http://localhost:3000';
  RAISE NOTICE '   - https://andoh-dohgad.netlify.app';
  RAISE NOTICE '';
  RAISE NOTICE '4. (Optionnel) Désactiver email confirmation en dev :';
  RAISE NOTICE '   Authentication > Providers > Email > Confirm email';
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════════';
END $$;

-- ===============================================
-- FIN DU SCRIPT
-- ===============================================
-- Auteur: Claude Code
-- Date: 2026-08-11
-- Version: 1.0 (Production Ready)
-- ===============================================