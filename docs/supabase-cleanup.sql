-- ========================================
-- NETTOYAGE ARTICLE DE TEST
-- ========================================
-- À exécuter dans Supabase SQL Editor

-- 1. Supprimer l'article de test "fffd hiuyty"
DELETE FROM blog_post_translations
WHERE post_id IN (
  SELECT id FROM blog_posts
  WHERE slug LIKE '%fffd%' OR slug LIKE '%hiuyty%'
);

DELETE FROM blog_posts
WHERE slug LIKE '%fffd%' OR slug LIKE '%hiuyty%';

-- OU si vous préférez le passer en brouillon:
-- UPDATE blog_posts
-- SET status = 'draft', published_at = NULL
-- WHERE slug LIKE '%fffd%' OR slug LIKE '%hiuyty%';

-- ========================================
-- VÉRIFICATION
-- ========================================

-- Voir tous les articles publiés
SELECT
  bp.id,
  bp.slug,
  bp.category,
  bp.status,
  bp.published_at,
  bpt.title,
  bpt.language
FROM blog_posts bp
LEFT JOIN blog_post_translations bpt ON bp.id = bpt.post_id
WHERE bp.status = 'active'
ORDER BY bp.published_at DESC;

-- ========================================
-- OPTIONNEL: MODIFIER NOM ADMIN
-- ========================================

-- Voir les profils admin
SELECT id, email, first_name, last_name, role
FROM profiles
WHERE role = 'admin';

-- Modifier le nom de l'admin
-- UPDATE profiles
-- SET
--   first_name = 'Administrateur',
--   last_name = 'Cabinet'
-- WHERE role = 'admin' AND email = 'votre-email-admin@example.com';

-- ========================================
-- OPTIONNEL: INSÉRER ARTICLES PROFESSIONNELS
-- ========================================

-- Si vous voulez ajouter les articles depuis blog.ts
-- (Nécessite de copier le contenu depuis src/data/blog.ts)
-- Exemple pour un article:

-- INSERT INTO blog_posts (slug, category, status, published_at, reading_time)
-- VALUES (
--   'reforme-fiscale-2025-pme-cote-ivoire',
--   'fiscalite',
--   'active',
--   '2025-06-15',
--   5
-- ) RETURNING id;

-- Puis ajouter la traduction FR:
-- INSERT INTO blog_post_translations (post_id, language, title, excerpt, content)
-- VALUES (
--   'uuid-du-post-ci-dessus',
--   'fr',
--   'Réforme fiscale 2025 : Ce qui change pour les PME en Côte d''Ivoire',
--   'Le gouvernement ivoirien a annoncé...',
--   'Contenu complet en markdown...'
-- );
