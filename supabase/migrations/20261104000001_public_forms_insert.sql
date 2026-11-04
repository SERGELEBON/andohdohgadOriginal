-- ============================================================================
-- Formulaires publics Contact & Rendez-vous → base de données
-- ----------------------------------------------------------------------------
-- Garantit qu'un visiteur (anonyme ou connecté) peut INSÉRER une demande
-- dans contact_messages et appointments, et que seuls les admins peuvent
-- les lire / modifier / supprimer depuis /admin.
-- Script idempotent : peut être exécuté plusieurs fois sans casser l'existant.
-- ============================================================================

-- 1. Privilèges de table (RLS filtre ensuite les lignes)
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT INSERT ON public.appointments     TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.appointments     TO authenticated;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments     ENABLE ROW LEVEL SECURITY;

-- 2. Valeurs par défaut du statut (affichage admin)
ALTER TABLE public.contact_messages ALTER COLUMN status SET DEFAULT 'new';
ALTER TABLE public.appointments     ALTER COLUMN status SET DEFAULT 'pending';

-- 3. INSERT public
DROP POLICY IF EXISTS "public_forms_insert_contact" ON public.contact_messages;
CREATE POLICY "public_forms_insert_contact"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "public_forms_insert_appointment" ON public.appointments;
CREATE POLICY "public_forms_insert_appointment"
  ON public.appointments FOR INSERT
  TO anon, authenticated
  -- un visiteur ne peut pas rattacher la demande au compte de quelqu'un d'autre
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- 4. Gestion complète par les admins (/admin/messages, /admin/rendez-vous)
DROP POLICY IF EXISTS "public_forms_admin_contact" ON public.contact_messages;
CREATE POLICY "public_forms_admin_contact"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "public_forms_admin_appointment" ON public.appointments;
CREATE POLICY "public_forms_admin_appointment"
  ON public.appointments FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- 5. Recharger le cache PostgREST
NOTIFY pgrst, 'reload schema';

-- Vérification (doit lister les 4 policies public_forms_*)
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public' AND tablename IN ('contact_messages', 'appointments')
ORDER BY tablename, policyname;
