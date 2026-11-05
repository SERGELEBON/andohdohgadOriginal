-- ============================================================================
-- Compteur « Utilisateurs » du tableau de bord
-- ----------------------------------------------------------------------------
-- Constat 2026-11-04 : 6 comptes dans auth.users mais seulement 2 profils
-- (les 2 admins). Les 4 comptes créés avant le trigger handle_new_user n'ont
-- jamais eu de ligne dans public.profiles → le dashboard affichait 0 et la
-- page Utilisateurs était vide.
-- Ce script crée les profils manquants (rôle repris des métadonnées s'il est
-- valide, sinon 'visitor'). Idempotent.
-- ============================================================================

INSERT INTO public.profiles (id, email, first_name, last_name, phone, role)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'first_name', ''),
  COALESCE(u.raw_user_meta_data->>'last_name', ''),
  COALESCE(u.raw_user_meta_data->>'phone', ''),
  CASE
    WHEN u.raw_user_meta_data->>'role' IN ('coworking_client', 'standard_client', 'visitor')
      THEN (u.raw_user_meta_data->>'role')::public.user_role
    ELSE 'visitor'::public.user_role   -- jamais 'admin' depuis les métadonnées
  END
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
  AND u.email IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Historique (Database > Migrations)
INSERT INTO supabase_migrations.schema_migrations (version, name, statements)
VALUES ('20261104000003', 'backfill_profiles', ARRAY['see supabase/migrations/20261104000003_backfill_profiles.sql'])
ON CONFLICT (version) DO NOTHING;

-- Vérification : comptes sans profil (doit être 0) et répartition des rôles
SELECT
  (SELECT count(*) FROM auth.users u LEFT JOIN public.profiles p ON p.id = u.id WHERE p.id IS NULL) AS comptes_sans_profil,
  (SELECT string_agg(role::text || ':' || c, ', ') FROM (SELECT role, count(*) c FROM public.profiles GROUP BY role) x) AS roles;
