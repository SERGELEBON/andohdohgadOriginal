-- =====================================================
-- SOLUTION COMPLÈTE SUPER ADMIN AUTO-CONFIRMÉ
-- =====================================================
-- Email: contact@andoh-dohgad.com
-- Ce script confirme l'email ET met à jour le rôle en admin
-- =====================================================

-- ÉTAPE 1 : Confirmer l'email automatiquement
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'contact@andoh-dohgad.com';

-- ÉTAPE 2 : Mettre à jour le profil en admin
UPDATE profiles
SET
  role = 'admin',
  first_name = 'Super',
  last_name = 'Admin',
  company_name = 'Andoh & Dohgad Consulting',
  updated_at = NOW()
WHERE email = 'contact@andoh-dohgad.com';

-- ÉTAPE 3 : Vérifier que tout est OK
SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  u.confirmed_at,
  p.role,
  p.first_name,
  p.last_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'contact@andoh-dohgad.com';

-- =====================================================
-- RÉSULTAT ATTENDU :
-- =====================================================
-- email_confirmed_at : [une date] ✓
-- confirmed_at : [une date] ✓
-- role : admin ✓
--
-- Si tout est ✓, vous pouvez vous connecter immédiatement !
--
-- =====================================================
-- CONNEXION AUTOMATIQUE
-- =====================================================
--
-- Méthode 1 : Route auto-login
-- http://localhost:3001/super-admin
-- → Détecte si le compte existe
-- → Le crée si nécessaire
-- → Vous guide pour la confirmation
-- → Connexion automatique
-- → Redirection vers /admin
--
-- Méthode 2 : Login classique
-- http://localhost:3001/connexion
-- Email : contact@andoh-dohgad.com
-- Password : (votre mot de passe)
--
-- =====================================================
-- EN CAS D'ERREUR "Email not confirmed"
-- =====================================================
--
-- Exécutez uniquement cette requête :
--
-- UPDATE auth.users
-- SET email_confirmed_at = NOW(), confirmed_at = NOW()
-- WHERE email = 'contact@andoh-dohgad.com';
--
-- Puis réessayez de vous connecter.
--
-- =====================================================
