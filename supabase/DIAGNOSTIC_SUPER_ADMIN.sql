-- =====================================================
-- DIAGNOSTIC COMPLET DU SUPER ADMIN
-- =====================================================
-- Ce script vérifie l'état exact du compte
-- =====================================================

-- 1. Vérifier si l'utilisateur existe dans auth.users
SELECT
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  CASE
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Email confirmé'
    ELSE '❌ Email NON confirmé'
  END as status_email
FROM auth.users
WHERE email = 'contact@andoh-dohgad.com';

-- 2. Vérifier le profil dans profiles
SELECT
  id,
  email,
  role,
  first_name,
  last_name,
  created_at,
  CASE
    WHEN role = 'admin' THEN '✅ Admin'
    ELSE '❌ PAS admin (role: ' || role || ')'
  END as status_role
FROM profiles
WHERE email = 'contact@andoh-dohgad.com';

-- 3. Compter les utilisateurs avec cet email
SELECT
  COUNT(*) as nombre_utilisateurs,
  CASE
    WHEN COUNT(*) = 0 THEN '❌ Aucun utilisateur trouvé'
    WHEN COUNT(*) = 1 THEN '✅ 1 utilisateur (OK)'
    ELSE '⚠️ PLUSIEURS utilisateurs (problème)'
  END as diagnostic
FROM auth.users
WHERE email = 'contact@andoh-dohgad.com';

-- =====================================================
-- RÉSULTATS ATTENDUS :
-- =====================================================
--
-- Requête 1 (auth.users) :
-- - id : [un UUID]
-- - email : contact@andoh-dohgad.com
-- - email_confirmed_at : [une date] (PAS NULL)
-- - status_email : ✅ Email confirmé
--
-- Requête 2 (profiles) :
-- - id : [même UUID]
-- - email : contact@andoh-dohgad.com
-- - role : admin
-- - status_role : ✅ Admin
--
-- Requête 3 :
-- - nombre_utilisateurs : 1
-- - diagnostic : ✅ 1 utilisateur (OK)
--
-- =====================================================
-- SI PROBLÈME DÉTECTÉ :
-- =====================================================

-- ❌ Si "Email NON confirmé" :
-- Exécuter :
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'contact@andoh-dohgad.com';

-- ❌ Si "PAS admin" :
-- Exécuter :
UPDATE profiles
SET role = 'admin'
WHERE email = 'contact@andoh-dohgad.com';

-- ❌ Si "Aucun utilisateur trouvé" :
-- L'utilisateur n'existe pas du tout !
-- Créer le compte via :
-- 1. Supabase Dashboard → Auth → Users → Add user
-- 2. Email : contact@andoh-dohgad.com
-- 3. Password : SuperAdmin@2026!
-- 4. Cocher "Auto Confirm User"
-- 5. Puis exécuter les UPDATE ci-dessus

-- ❌ Si "PLUSIEURS utilisateurs" :
-- Problème de duplication !
-- Voir lesquels et supprimer les doublons

-- =====================================================
