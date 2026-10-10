-- =====================================================================
-- Sécurisation des rôles et de l'accès administrateur
-- À exécuter dans Supabase > SQL Editor (idempotent : peut être relancé)
--
-- Corrige :
--   1. Le rôle envoyé par le client à l'inscription était recopié dans
--      profiles -> n'importe qui pouvait s'inscrire comme 'admin' via l'API.
--   2. Un utilisateur pouvait modifier son propre rôle (UPDATE sur profiles).
--   3. Les politiques RLS de profiles s'appelaient elles-mêmes (récursion).
-- =====================================================================

-- 1. L'utilisateur courant est-il administrateur ?
--    SECURITY DEFINER : lit profiles sans repasser par RLS (pas de récursion).
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 2. Tout nouveau compte est 'visitor' : le rôle fourni par le client est ignoré.
--    Seul un administrateur peut ensuite attribuer un rôle.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'visitor'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user() a échoué pour % : %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$;

-- 3. Interdire l'auto-promotion : seul un admin peut changer un rôle.
--    (auth.uid() est NULL pour le SQL Editor et la clé service_role : autorisé.)
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role
     AND auth.uid() IS NOT NULL
     AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Modification du rôle non autorisée' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_role_escalation ON public.profiles;
CREATE TRIGGER prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- 4. Politiques RLS de profiles sans récursion
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- "Users can update own profile" est conservée : le trigger ci-dessus
-- empêche désormais de modifier son propre rôle.

-- 5. S'assurer que le trigger d'inscription existe (sans bloquer le script)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE WARNING 'Impossible de créer on_auth_user_created (droits insuffisants).';
END $$;

-- 6. Compte administrateur principal
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'contact@andoh-dohgad.com';

-- 7. Vérification : liste des administrateurs (contrôlez qu'il n'y a pas d'intrus)
SELECT id, email, role, created_at
FROM public.profiles
WHERE role = 'admin'
ORDER BY created_at;
