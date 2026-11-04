-- ============================================================================
-- Règles d'accès : le visiteur AJOUTE, seul l'administrateur LIT
-- Projet : andohdohgad (tszsvbzfufglvdcsjzpo) — script idempotent
-- ----------------------------------------------------------------------------
-- Audit du 2026-11-04 :
--  * RLS DÉSACTIVÉE sur documentation_purchases et coworking_subscriptions :
--    n'importe quel visiteur pouvait lire toutes les lignes avec la clé publique.
--  * surveys (demandes de service) : policies OK mais appliquées au rôle
--    "public" ; on les rend explicites et on utilise is_admin().
-- ============================================================================

-- 1. Activer la RLS partout où des données clients sont stockées
ALTER TABLE public.documentation_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coworking_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments            ENABLE ROW LEVEL SECURITY;

-- 2. Un visiteur ne peut jamais vider une table, même si la RLS change
REVOKE TRUNCATE ON public.surveys, public.contact_messages, public.appointments,
  public.documentation_purchases, public.coworking_subscriptions FROM anon, authenticated;

-- 3. Demandes de service (table surveys)
GRANT INSERT ON public.surveys TO anon, authenticated;

DROP POLICY IF EXISTS "surveys_insert_policy" ON public.surveys;
CREATE POLICY "surveys_insert_policy"
  ON public.surveys FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending' AND assigned_to IS NULL);

DROP POLICY IF EXISTS "surveys_select_admin_policy" ON public.surveys;
CREATE POLICY "surveys_select_admin_policy"
  ON public.surveys FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "surveys_update_admin_policy" ON public.surveys;
CREATE POLICY "surveys_update_admin_policy"
  ON public.surveys FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "surveys_delete_admin_policy" ON public.surveys;
CREATE POLICY "surveys_delete_admin_policy"
  ON public.surveys FOR DELETE TO authenticated USING (public.is_admin());

-- 4. Historique (Database > Migrations)
CREATE SCHEMA IF NOT EXISTS supabase_migrations;
CREATE TABLE IF NOT EXISTS supabase_migrations.schema_migrations (
  version text PRIMARY KEY, statements text[], name text
);
INSERT INTO supabase_migrations.schema_migrations (version, name, statements)
VALUES ('20261104000002', 'rls_access_rules', ARRAY['see supabase/migrations/20261104000002_rls_access_rules.sql'])
ON CONFLICT (version) DO NOTHING;

NOTIFY pgrst, 'reload schema';

-- Vérification : rls doit être true pour les 5 tables
SELECT relname AS table_name, relrowsecurity AS rls
FROM pg_class
WHERE relnamespace = 'public'::regnamespace
  AND relname IN ('surveys','contact_messages','appointments','documentation_purchases','coworking_subscriptions')
ORDER BY 1;
