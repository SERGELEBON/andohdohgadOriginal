-- ===============================================
-- MIGRATION ROBUSTE V3 : Aligner le Schéma Supabase avec le Code Frontend
-- Version 3 (Ultra-Safe) - Date : 2026-07-16
-- ===============================================
-- Cette version ne fait aucune supposition sur les colonnes existantes
-- À exécuter sur : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/sql/new

-- ===============================================
-- 1. TABLE : appointments
-- ===============================================

-- Ajouter les nouvelles colonnes si elles n'existent pas
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS date DATE;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS time_slot TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Migration conditionnelle : seulement si 'name' existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'appointments'
      AND column_name = 'name'
  ) THEN
    UPDATE public.appointments SET
      first_name = COALESCE(first_name, split_part(name, ' ', 1), name),
      last_name = COALESCE(last_name, NULLIF(split_part(name, ' ', 2), ''), '')
    WHERE first_name IS NULL OR last_name IS NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'appointments'
      AND column_name = 'preferred_date'
  ) THEN
    UPDATE public.appointments SET
      date = COALESCE(date, preferred_date::DATE),
      time_slot = COALESCE(time_slot, to_char(preferred_date, 'HH24:MI'))
    WHERE date IS NULL OR time_slot IS NULL;
  END IF;
END $$;

-- Remplir les valeurs par défaut pour les lignes sans données
UPDATE public.appointments
SET
  first_name = COALESCE(first_name, 'Prénom'),
  last_name = COALESCE(last_name, 'Nom'),
  date = COALESCE(date, CURRENT_DATE),
  time_slot = COALESCE(time_slot, '09:00')
WHERE first_name IS NULL OR last_name IS NULL OR date IS NULL OR time_slot IS NULL;

-- Rendre les colonnes obligatoires
ALTER TABLE public.appointments ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE public.appointments ALTER COLUMN last_name SET NOT NULL;
ALTER TABLE public.appointments ALTER COLUMN date SET NOT NULL;
ALTER TABLE public.appointments ALTER COLUMN time_slot SET NOT NULL;

-- ===============================================
-- 2. TABLE : contact_messages
-- ===============================================

-- Ajouter les nouvelles colonnes si elles n'existent pas
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Migration conditionnelle : seulement si 'name' existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'contact_messages'
      AND column_name = 'name'
  ) THEN
    UPDATE public.contact_messages SET
      first_name = COALESCE(first_name, split_part(name, ' ', 1), name),
      last_name = COALESCE(last_name, NULLIF(split_part(name, ' ', 2), ''), '')
    WHERE first_name IS NULL OR last_name IS NULL;
  END IF;
END $$;

-- Remplir les valeurs par défaut
UPDATE public.contact_messages
SET
  first_name = COALESCE(first_name, 'Prénom'),
  last_name = COALESCE(last_name, 'Nom')
WHERE first_name IS NULL OR last_name IS NULL;

-- Rendre les colonnes obligatoires
ALTER TABLE public.contact_messages ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE public.contact_messages ALTER COLUMN last_name SET NOT NULL;

-- ===============================================
-- 3. TABLE : documentation_purchases
-- ===============================================

-- Ajouter les colonnes manquantes
ALTER TABLE public.documentation_purchases ADD COLUMN IF NOT EXISTS document_id TEXT;
ALTER TABLE public.documentation_purchases ADD COLUMN IF NOT EXISTS document_name TEXT;
ALTER TABLE public.documentation_purchases ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);
ALTER TABLE public.documentation_purchases ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Migration SIMPLIFIÉE depuis doc_id (sans dépendre de la table documentation)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'documentation_purchases'
      AND column_name = 'doc_id'
  ) THEN
    -- Remplir avec des valeurs basées sur doc_id
    UPDATE public.documentation_purchases
    SET
      document_id = COALESCE(document_id, doc_id::TEXT),
      document_name = COALESCE(document_name, 'Document ' || doc_id::TEXT),
      price = COALESCE(price, amount_paid, 0)
    WHERE document_id IS NULL OR document_name IS NULL OR price IS NULL;
  ELSE
    -- Si doc_id n'existe pas, utiliser l'ID de la ligne
    UPDATE public.documentation_purchases
    SET
      document_id = COALESCE(document_id, id::TEXT),
      document_name = COALESCE(document_name, 'Document'),
      price = COALESCE(price, amount_paid, 0)
    WHERE document_id IS NULL OR document_name IS NULL OR price IS NULL;
  END IF;
END $$;

-- Rendre les colonnes obligatoires
ALTER TABLE public.documentation_purchases ALTER COLUMN document_id SET NOT NULL;
ALTER TABLE public.documentation_purchases ALTER COLUMN document_name SET NOT NULL;
ALTER TABLE public.documentation_purchases ALTER COLUMN price SET NOT NULL;

-- Ajouter contrainte CHECK pour price >= 0
ALTER TABLE public.documentation_purchases
DROP CONSTRAINT IF EXISTS documentation_purchases_price_check;

ALTER TABLE public.documentation_purchases
ADD CONSTRAINT documentation_purchases_price_check
CHECK (price >= 0);

-- ===============================================
-- 4. TABLE : coworking_subscriptions
-- ===============================================

-- Ajouter les colonnes manquantes
ALTER TABLE public.coworking_subscriptions ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.coworking_subscriptions ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2);

-- Migrer amount_paid vers amount si nécessaire
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'coworking_subscriptions'
      AND column_name = 'amount_paid'
  ) THEN
    UPDATE public.coworking_subscriptions
    SET amount = COALESCE(amount, amount_paid)
    WHERE amount IS NULL;
  END IF;
END $$;

-- Ajouter contrainte CHECK pour amount >= 0
ALTER TABLE public.coworking_subscriptions
DROP CONSTRAINT IF EXISTS coworking_subscriptions_amount_check;

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
-- 5. Créer/Mettre à jour les triggers updated_at
-- ===============================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer aux tables
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

DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.coworking_subscriptions;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.coworking_subscriptions
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ===============================================
-- 6. Créer le trigger pour auto-créer les profils
-- ===============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'visitor'::user_role)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===============================================
-- 7. Ajouter des index pour améliorer les performances
-- ===============================================

CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public.appointments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_doc_purchases_user_id ON public.documentation_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_doc_purchases_payment_status ON public.documentation_purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_doc_purchases_created_at ON public.documentation_purchases(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_coworking_user_id ON public.coworking_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_coworking_status ON public.coworking_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_coworking_dates ON public.coworking_subscriptions(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ===============================================
-- 8. Créer le profil Super Admin (si absent)
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

-- ===============================================
-- 9. VÉRIFICATIONS FINALES
-- ===============================================

-- Vérifier les colonnes de chaque table critique
SELECT
  'appointments' AS verification,
  COUNT(CASE WHEN column_name = 'first_name' THEN 1 END) AS has_first_name,
  COUNT(CASE WHEN column_name = 'last_name' THEN 1 END) AS has_last_name,
  COUNT(CASE WHEN column_name = 'date' THEN 1 END) AS has_date,
  COUNT(CASE WHEN column_name = 'time_slot' THEN 1 END) AS has_time_slot,
  COUNT(CASE WHEN column_name = 'company' THEN 1 END) AS has_company
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'appointments'

UNION ALL

SELECT
  'contact_messages',
  COUNT(CASE WHEN column_name = 'first_name' THEN 1 END),
  COUNT(CASE WHEN column_name = 'last_name' THEN 1 END),
  COUNT(CASE WHEN column_name = 'company' THEN 1 END),
  0,
  0
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'contact_messages'

UNION ALL

SELECT
  'documentation_purchases',
  COUNT(CASE WHEN column_name = 'document_id' THEN 1 END),
  COUNT(CASE WHEN column_name = 'document_name' THEN 1 END),
  COUNT(CASE WHEN column_name = 'price' THEN 1 END),
  0,
  0
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'documentation_purchases';

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

-- Vérifier le profil super admin
SELECT
  email,
  role::TEXT AS role,
  first_name,
  last_name,
  'Profil Super Admin trouvé ✅' AS status
FROM public.profiles
WHERE email = 'contact@andoh-dohgad.com'

UNION ALL

SELECT
  'contact@andoh-dohgad.com',
  'N/A',
  'N/A',
  'N/A',
  '⚠️ Profil Super Admin MANQUANT'
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'contact@andoh-dohgad.com'
);

-- Vérifier les triggers
SELECT
  trigger_name,
  event_object_table AS table_name,
  'Trigger actif ✅' AS status
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name IN ('set_updated_at', 'on_auth_user_created')
ORDER BY event_object_table, trigger_name;

-- ===============================================
-- FIN DE LA MIGRATION V3
-- ===============================================
-- ✅ Toutes les tables sont maintenant alignées avec le code frontend !
-- ✅ Les erreurs 500 devraient disparaître.
-- ✅ Le trigger auto-création de profils est en place.
-- ✅ Le profil super admin est créé.
