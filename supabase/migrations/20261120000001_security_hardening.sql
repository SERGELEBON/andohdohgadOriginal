-- =====================================================================
-- Audit de sécurité du 20/11/2026 — à exécuter dans Supabase > SQL Editor
-- Idempotent : peut être relancé sans risque. Ne supprime aucune donnée.
--
-- Corrige :
--   1. documentation_purchases : n'importe qui pouvait créer ou MODIFIER un
--      achat (politiques « System can … » à true) → passer un achat en
--      « completed » et télécharger un document payant gratuitement.
--   2. appointments : l'ancienne règle d'insertion « true » restait active à
--      côté de la règle stricte (les règles s'additionnent) → on pouvait créer
--      un rendez-vous au nom d'un autre compte (user_id d'autrui).
--   3. coworking_subscriptions : un client pouvait créer son abonnement
--      directement avec le statut « active ».
--   4. contact_messages : doublon de règle d'insertion ; limites de taille
--      sur les champs (anti-spam / anti-saturation).
-- =====================================================================

-- 1. Achats de documents : réservé aux administrateurs
--    (le paiement passe par WhatsApp ; l'admin enregistre l'achat).
DROP POLICY IF EXISTS "System can insert purchases" ON public.documentation_purchases;
DROP POLICY IF EXISTS "System can update purchases" ON public.documentation_purchases;
DROP POLICY IF EXISTS "Admins can manage purchases" ON public.documentation_purchases;
CREATE POLICY "Admins can manage purchases"
  ON public.documentation_purchases FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
-- La règle « Users can view own purchases » (lecture de ses propres achats) est conservée.

-- 2. Rendez-vous : seule la règle stricte reste
--    (« Anyone can create appointments » : user_id vide ou égal au compte connecté).
DROP POLICY IF EXISTS "Users can create appointments" ON public.appointments;

-- 3. Co-working : une demande d'abonnement est toujours créée « en attente »
DROP POLICY IF EXISTS "Users can create subscription requests" ON public.coworking_subscriptions;
CREATE POLICY "Users can create subscription requests"
  ON public.coworking_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'pending');

-- 4. Messages de contact : une seule règle d'insertion + limites de taille
DROP POLICY IF EXISTS "Anyone can create contact messages" ON public.contact_messages;
-- (« Anyone can create messages », créée le 04/11, reste en place)

-- Chaque limite dans son propre bloc : si une colonne manque, les autres s'appliquent quand même.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_messages_size_limits') THEN
    ALTER TABLE public.contact_messages ADD CONSTRAINT contact_messages_size_limits CHECK (
      char_length(coalesce(name, ''))       <= 200
      AND char_length(coalesce(email, ''))   <= 320
      AND char_length(coalesce(phone, ''))   <= 40
      AND char_length(coalesce(subject, '')) <= 300
      AND char_length(coalesce(message, '')) <= 5000
    ) NOT VALID;  -- NOT VALID : ne contrôle que les nouveaux messages
  END IF;
EXCEPTION
  WHEN undefined_column OR undefined_table THEN
    RAISE WARNING 'Limites contact_messages non appliquées : %', SQLERRM;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'appointments_size_limits') THEN
    ALTER TABLE public.appointments ADD CONSTRAINT appointments_size_limits CHECK (
      char_length(coalesce(first_name, ''))  <= 100
      AND char_length(coalesce(last_name, '')) <= 100
      AND char_length(coalesce(email, ''))     <= 320
      AND char_length(coalesce(phone, ''))     <= 40
      AND char_length(coalesce(message, ''))   <= 5000
    ) NOT VALID;
  END IF;
EXCEPTION
  WHEN undefined_column OR undefined_table THEN
    RAISE WARNING 'Limites appointments non appliquées : %', SQLERRM;
END $$;

NOTIFY pgrst, 'reload schema';

-- 5. Vérification : règles restantes sur les tables sensibles
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('documentation_purchases', 'appointments', 'coworking_subscriptions', 'contact_messages', 'profiles')
ORDER BY tablename, cmd, policyname;

-- 6. Vérification : administrateurs (contrôlez qu'il n'y a pas d'intrus)
SELECT id, email, role, created_at FROM public.profiles WHERE role = 'admin' ORDER BY created_at;
