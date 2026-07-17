-- ===============================================
-- MIGRATION : Aligner le Schéma Supabase avec le Code Frontend
-- Date : 2026-07-16
-- ===============================================
-- À exécuter sur : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/sql/new

-- ===============================================
-- 1. TABLE : appointments
-- ===============================================
-- Problème : name (au lieu de first_name + last_name)
-- Problème : preferred_date (au lieu de date + time_slot)
-- Problème : manque company

-- Ajouter les nouvelles colonnes
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS date DATE;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS time_slot TEXT;

-- Migrer les données existantes
UPDATE public.appointments SET
  first_name = COALESCE(split_part(name, ' ', 1), name),
  last_name = COALESCE(NULLIF(split_part(name, ' ', 2), ''), ''),
  date = preferred_date::DATE,
  time_slot = to_char(preferred_date, 'HH24:MI')
WHERE first_name IS NULL;

-- Rendre first_name, date, time_slot obligatoires
ALTER TABLE public.appointments ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE public.appointments ALTER COLUMN last_name SET NOT NULL;
ALTER TABLE public.appointments ALTER COLUMN date SET NOT NULL;
ALTER TABLE public.appointments ALTER COLUMN time_slot SET NOT NULL;

-- Supprimer les anciennes colonnes (optionnel - à décommenter si vous êtes sûr)
-- ALTER TABLE public.appointments DROP COLUMN IF EXISTS name;
-- ALTER TABLE public.appointments DROP COLUMN IF EXISTS preferred_date;

-- ===============================================
-- 2. TABLE : contact_messages
-- ===============================================
-- Problème : name (au lieu de first_name + last_name)
-- Problème : manque company

-- Ajouter les nouvelles colonnes
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS company TEXT;

-- Migrer les données existantes
UPDATE public.contact_messages SET
  first_name = COALESCE(split_part(name, ' ', 1), name),
  last_name = COALESCE(NULLIF(split_part(name, ' ', 2), ''), '')
WHERE first_name IS NULL;

-- Rendre first_name et last_name obligatoires
ALTER TABLE public.contact_messages ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE public.contact_messages ALTER COLUMN last_name SET NOT NULL;

-- Supprimer l'ancienne colonne (optionnel - à décommenter si vous êtes sûr)
-- ALTER TABLE public.contact_messages DROP COLUMN IF EXISTS name;

-- ===============================================
-- 3. TABLE : documentation_purchases
-- ===============================================
-- Problème : doc_id (UUID) mais le code attend document_id (string), document_name, price

-- Ajouter les colonnes manquantes
ALTER TABLE public.documentation_purchases ADD COLUMN IF NOT EXISTS document_id TEXT;
ALTER TABLE public.documentation_purchases ADD COLUMN IF NOT EXISTS document_name TEXT;
ALTER TABLE public.documentation_purchases ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);

-- Migrer les données existantes (si possible)
-- NOTE: Si vous avez une table 'documentation', cette requête récupère les données
UPDATE public.documentation_purchases dp
SET
  document_id = COALESCE(dp.document_id, d.id::TEXT),
  document_name = COALESCE(dp.document_name, d.title_fr, 'Document'),
  price = COALESCE(dp.price, dp.amount_paid, 0)
FROM public.documentation d
WHERE dp.doc_id = d.id
  AND dp.document_id IS NULL;

-- Si pas de table documentation, remplir avec des valeurs par défaut
UPDATE public.documentation_purchases
SET
  document_id = COALESCE(document_id, doc_id::TEXT),
  document_name = COALESCE(document_name, 'Document ' || doc_id::TEXT),
  price = COALESCE(price, amount_paid, 0)
WHERE document_id IS NULL;

-- Rendre les colonnes obligatoires
ALTER TABLE public.documentation_purchases ALTER COLUMN document_id SET NOT NULL;
ALTER TABLE public.documentation_purchases ALTER COLUMN document_name SET NOT NULL;
ALTER TABLE public.documentation_purchases ALTER COLUMN price SET NOT NULL;

-- Ajouter contrainte CHECK pour price >= 0
ALTER TABLE public.documentation_purchases
ADD CONSTRAINT documentation_purchases_price_check
CHECK (price >= 0);

-- Supprimer doc_id si vous n'en avez plus besoin (optionnel)
-- ALTER TABLE public.documentation_purchases DROP COLUMN IF EXISTS doc_id;

-- ===============================================
-- 4. TABLE : coworking_subscriptions
-- ===============================================
-- Vérifier que les colonnes payment_method et amount existent

ALTER TABLE public.coworking_subscriptions ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.coworking_subscriptions ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2);

-- Migrer amount_paid → amount si nécessaire
UPDATE public.coworking_subscriptions
SET amount = amount_paid
WHERE amount IS NULL AND amount_paid IS NOT NULL;

-- Ajouter contrainte CHECK pour amount >= 0
ALTER TABLE public.coworking_subscriptions
ADD CONSTRAINT coworking_subscriptions_amount_check
CHECK (amount >= 0 OR amount IS NULL);

-- Ajouter contrainte CHECK pour les dates
ALTER TABLE public.coworking_subscriptions
DROP CONSTRAINT IF EXISTS coworking_subscriptions_date_check;

ALTER TABLE public.coworking_subscriptions
ADD CONSTRAINT coworking_subscriptions_date_check
CHECK (end_date >= start_date);

-- ===============================================
-- 5. Ajouter updated_at manquant sur certaines tables
-- ===============================================

ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.documentation_purchases ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ===============================================
-- 6. Créer/Mettre à jour les triggers updated_at
-- ===============================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer aux tables (supprimer d'abord si existe)
DROP TRIGGER IF EXISTS set_updated_at ON public.appointments;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.contact_messages;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.contact_messages
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.documentation_purchases;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.documentation_purchases
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ===============================================
-- 7. Ajouter des index pour améliorer les performances
-- ===============================================

CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(date);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_doc_purchases_user_id ON public.documentation_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_doc_purchases_payment_status ON public.documentation_purchases(payment_status);

CREATE INDEX IF NOT EXISTS idx_coworking_user_id ON public.coworking_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_coworking_status ON public.coworking_subscriptions(status);

-- ===============================================
-- 8. VÉRIFICATIONS
-- ===============================================

-- Vérifier les colonnes de chaque table
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('appointments', 'contact_messages', 'documentation_purchases', 'coworking_subscriptions')
ORDER BY table_name, ordinal_position;

-- Compter les lignes dans chaque table
SELECT 'appointments' AS table_name, COUNT(*) AS row_count FROM public.appointments
UNION ALL
SELECT 'contact_messages', COUNT(*) FROM public.contact_messages
UNION ALL
SELECT 'documentation_purchases', COUNT(*) FROM public.documentation_purchases
UNION ALL
SELECT 'coworking_subscriptions', COUNT(*) FROM public.coworking_subscriptions
UNION ALL
SELECT 'profiles', COUNT(*) FROM public.profiles;

-- ===============================================
-- 9. Créer le profil Super Admin (si absent)
-- ===============================================

INSERT INTO public.profiles (id, email, first_name, last_name, role, created_at, updated_at)
SELECT
  id,
  'contact@andoh-dohgad.com',
  'Super',
  'Admin',
  'admin'::user_role,
  now(),
  now()
FROM auth.users
WHERE email = 'contact@andoh-dohgad.com'
AND NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'contact@andoh-dohgad.com'
);

-- Vérifier que le profil super admin existe
SELECT email, role, first_name, last_name
FROM public.profiles
WHERE email = 'contact@andoh-dohgad.com';

-- ===============================================
-- FIN DE LA MIGRATION
-- ===============================================
-- Toutes les tables sont maintenant alignées avec le code frontend !
-- Les erreurs 500 devraient disparaître.
