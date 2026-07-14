-- ============================================================================
-- SETUP COMPTE ADMIN
-- ============================================================================
-- Ce script crée le compte admin avec email contact@andoh-dohgad.com
-- et met à jour son rôle pour lui donner les droits administrateur
--
-- À exécuter dans Supabase SQL Editor après avoir créé l'utilisateur via
-- Authentication > Users > Add user
-- ============================================================================

-- 1. Vérifier que l'utilisateur existe dans auth.users
SELECT
    id,
    email,
    created_at
FROM auth.users
WHERE email = 'contact@andoh-dohgad.com';

-- Si l'utilisateur n'existe pas, le créer d'abord dans l'interface :
-- Authentication > Users > Add user
-- Email: contact@andoh-dohgad.com
-- Password: [votre choix]
-- ✓ Auto Confirm User

-- 2. Vérifier que la table profiles existe
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
);

-- 3. Vérifier si un profil existe déjà
SELECT * FROM profiles WHERE email = 'contact@andoh-dohgad.com';

-- 4. Si le profil existe, mettre à jour le rôle en admin
UPDATE profiles
SET
    role = 'admin',
    first_name = 'Admin',
    last_name = 'Andoh & Dohgad',
    updated_at = now()
WHERE email = 'contact@andoh-dohgad.com';

-- 5. Si le profil n'existe pas, le créer
-- (Remplacer [USER_ID] par l'ID de l'utilisateur obtenu à l'étape 1)
/*
INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    created_at,
    updated_at
) VALUES (
    '[USER_ID]'::uuid,  -- Remplacer par l'UUID réel
    'contact@andoh-dohgad.com',
    'Admin',
    'Andoh & Dohgad',
    'admin',
    now(),
    now()
);
*/

-- 6. Vérifier que le profil admin est bien créé
SELECT
    id,
    email,
    first_name,
    last_name,
    role,
    created_at
FROM profiles
WHERE email = 'contact@andoh-dohgad.com';

-- Résultat attendu :
-- role = 'admin'
-- first_name = 'Admin'
-- last_name = 'Andoh & Dohgad'

-- ============================================================================
-- TESTS DE VÉRIFICATION
-- ============================================================================

-- Test 1 : Compter les utilisateurs
SELECT COUNT(*) as total_users FROM profiles;

-- Test 2 : Compter les admins
SELECT COUNT(*) as total_admins FROM profiles WHERE role = 'admin';

-- Test 3 : Lister tous les profils avec leur rôle
SELECT
    email,
    first_name,
    last_name,
    role,
    created_at
FROM profiles
ORDER BY created_at DESC;

-- ============================================================================
-- DONNÉES DE TEST (Optionnel)
-- ============================================================================

-- Créer quelques rendez-vous de test (pour stats admin)
/*
INSERT INTO appointments (user_id, service, appointment_date, time_slot, status)
SELECT
    id,
    'Consultation fiscale',
    CURRENT_DATE + INTERVAL '7 days',
    '10:00',
    'pending'
FROM profiles
WHERE email != 'contact@andoh-dohgad.com'
LIMIT 3;
*/

-- Créer quelques sondages de test
/*
INSERT INTO surveys (user_id, survey_type, responses, status)
SELECT
    id,
    'besoins_entreprise',
    '{"question1": "reponse1"}'::jsonb,
    'new'
FROM profiles
WHERE email != 'contact@andoh-dohgad.com'
LIMIT 5;
*/

-- Créer quelques messages de test
/*
INSERT INTO contact_messages (
    full_name,
    email,
    subject,
    message,
    status
) VALUES
    ('Jean Dupont', 'jean@example.com', 'Demande de renseignements', 'Bonjour, je voudrais des informations...', 'new'),
    ('Marie Martin', 'marie@example.com', 'Question fiscale', 'J''ai une question concernant...', 'new');
*/

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================
