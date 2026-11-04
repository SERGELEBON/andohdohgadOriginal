-- ============================================================================
-- Formulaires publics Contact & Rendez-vous → base de données
-- Projet : andohdohgad (tszsvbzfufglvdcsjzpo) — script idempotent
-- ----------------------------------------------------------------------------
-- État constaté le 2026-11-04 :
--  * contact_messages.first_name / last_name étaient NOT NULL sans défaut
--    → un formulaire Contact qui n'envoie que "name" était rejeté.
--  * policy INSERT appointments "WITH CHECK (true)" : un visiteur pouvait
--    rattacher une demande au user_id de quelqu'un d'autre.
-- ============================================================================

-- 1. Contact : prénom / nom facultatifs (le formulaire envoie "name")
ALTER TABLE public.contact_messages ALTER COLUMN first_name DROP NOT NULL;
ALTER TABLE public.contact_messages ALTER COLUMN last_name  DROP NOT NULL;

-- 2. Statuts par défaut (lus par /admin)
ALTER TABLE public.contact_messages ALTER COLUMN status SET DEFAULT 'new';
ALTER TABLE public.appointments     ALTER COLUMN status SET DEFAULT 'pending';

-- 3. RLS active + droit d'INSERT pour les visiteurs
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments     ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT INSERT ON public.appointments     TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can create messages" ON public.contact_messages;
CREATE POLICY "Anyone can create messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;
CREATE POLICY "Anyone can create appointments"
  ON public.appointments FOR INSERT
  TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- (Les policies admin existantes "Admins can manage all ..." via is_admin() sont conservées.)

-- 4. Recharger le cache de l'API
NOTIFY pgrst, 'reload schema';
