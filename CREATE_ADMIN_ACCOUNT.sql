-- Script SQL pour créer le compte Super Admin
-- À exécuter sur : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/sql/new

-- IMPORTANT : Ce script NE PEUT PAS créer l'utilisateur dans auth.users
-- car cela nécessite des privilèges service_role.
-- Utilisez plutôt le Dashboard UI pour créer l'utilisateur.

-- Instructions :
-- 1. Créez d'abord l'utilisateur via le Dashboard :
--    https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/auth/users
--    - Cliquez "Add user"
--    - Email : contact@andoh-dohgad.com
--    - Password : SuperAdmin@2026!
--    - ✅ COCHEZ "Auto Confirm User"
--    - Cliquez "Create user"
--    - COPIEZ L'ID DE L'UTILISATEUR CRÉÉ

-- 2. Ensuite, exécutez cette requête en remplaçant 'VOTRE_USER_ID' par l'ID copié :

INSERT INTO profiles (
  id,
  email,
  first_name,
  last_name,
  role,
  created_at,
  updated_at
)
VALUES (
  'VOTRE_USER_ID', -- Remplacez par l'UUID de l'utilisateur créé à l'étape 1
  'contact@andoh-dohgad.com',
  'Super',
  'Admin',
  'admin',
  now(),
  now()
);

-- 3. Vérifiez que ça a fonctionné :
SELECT email, role, first_name, last_name FROM profiles WHERE email = 'contact@andoh-dohgad.com';

-- 4. Connectez-vous sur le site avec :
--    Email : contact@andoh-dohgad.com
--    Mot de passe : SuperAdmin@2026!
