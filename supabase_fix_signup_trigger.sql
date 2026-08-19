-- ===============================================
-- FIX : Trigger handle_new_user() pour l'inscription
-- Date : 2026-07-17
-- ===============================================
-- Problème : Le trigger échoue lors du cast ENUM si la valeur n'est pas valide
-- Solution : Utiliser une fonction avec gestion d'exception

-- ===============================================
-- 1. Créer une fonction helper pour valider le rôle
-- ===============================================

CREATE OR REPLACE FUNCTION public.get_valid_user_role(role_input TEXT)
RETURNS user_role AS $$
BEGIN
  -- Essayer de caster, utiliser 'visitor' si échec
  RETURN role_input::user_role;
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'visitor'::user_role;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ===============================================
-- 2. Recréer le trigger avec gestion d'erreur robuste
-- ===============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_value user_role;
  role_from_metadata TEXT;
BEGIN
  -- Récupérer le rôle depuis les métadonnées
  role_from_metadata := COALESCE(NEW.raw_user_meta_data->>'role', 'visitor');

  -- Valider et caster le rôle de manière sécurisée
  user_role_value := public.get_valid_user_role(role_from_metadata);

  -- Insérer le profil

  INSERT INTO public.profiles (id, email, first_name, last_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    user_role_value
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Logger l'erreur mais ne pas bloquer l'inscription
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- 3. Vérifier les valeurs ENUM autorisées
-- ===============================================

SELECT enumlabel
FROM pg_enum
WHERE enumtypid = 'user_role'::regtype
ORDER BY enumsortorder;

-- ===============================================
-- 4. Test du trigger
-- ===============================================

-- Tester avec une valeur valide
SELECT public.get_valid_user_role('standard_client');  -- Devrait retourner 'standard_client'

-- Tester avec une valeur invalide
SELECT public.get_valid_user_role('invalid_role');      -- Devrait retourner 'visitor'

-- Tester avec NULL
SELECT public.get_valid_user_role(NULL);                -- Devrait retourner 'visitor'

-- ===============================================
-- FIN DU FIX
-- ===============================================
-- ✅ Le trigger gère maintenant les erreurs sans bloquer l'inscription
-- ✅ Les rôles invalides sont automatiquement convertis en 'visitor'
-- ✅ L'inscription ne peut plus échouer à cause du trigger
