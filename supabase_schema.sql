-- ===============================================
-- SCHÉMA COMPLET SUPABASE
-- Andoh & Dohgad Consulting Database
-- ===============================================
-- À exécuter sur : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/sql/new

-- ===============================================
-- 1. TABLE : profiles
-- ===============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company_name TEXT,
  role TEXT NOT NULL DEFAULT 'visitor' CHECK (role IN ('admin', 'coworking_client', 'standard_client', 'visitor')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ===============================================
-- 2. TABLE : appointments
-- ===============================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public.appointments(created_at DESC);

-- ===============================================
-- 3. TABLE : contact_messages
-- ===============================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- ===============================================
-- 4. TABLE : documentation_purchases
-- ===============================================
CREATE TABLE IF NOT EXISTS public.documentation_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  document_id TEXT NOT NULL,
  document_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('orange_money', 'mtn_momo', 'stripe', 'cash')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_doc_purchases_user_id ON public.documentation_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_doc_purchases_status ON public.documentation_purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_doc_purchases_created_at ON public.documentation_purchases(created_at DESC);

-- ===============================================
-- 5. TABLE : coworking_subscriptions
-- ===============================================
CREATE TABLE IF NOT EXISTS public.coworking_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('hourly', 'daily', 'weekly', 'monthly')),
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'suspended')),
  payment_method TEXT,
  amount DECIMAL(10,2) CHECK (amount >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_coworking_user_id ON public.coworking_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_coworking_status ON public.coworking_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_coworking_dates ON public.coworking_subscriptions(start_date, end_date);

-- ===============================================
-- 6. TRIGGER : Créer automatiquement le profil
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
    COALESCE(NEW.raw_user_meta_data->>'role', 'visitor')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer le trigger existant s'il existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===============================================
-- 7. FUNCTION : Mettre à jour updated_at automatiquement
-- ===============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer aux tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.documentation_purchases
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.coworking_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ===============================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ===============================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coworking_subscriptions ENABLE ROW LEVEL SECURITY;

-- ===============================================
-- POLICIES pour profiles
-- ===============================================
DROP POLICY IF EXISTS "Utilisateurs peuvent voir leur propre profil" ON public.profiles;
CREATE POLICY "Utilisateurs peuvent voir leur propre profil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins peuvent tout voir" ON public.profiles;
CREATE POLICY "Admins peuvent tout voir"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Utilisateurs peuvent mettre à jour leur profil" ON public.profiles;
CREATE POLICY "Utilisateurs peuvent mettre à jour leur profil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ===============================================
-- POLICIES pour appointments
-- ===============================================
DROP POLICY IF EXISTS "Utilisateurs voient leurs propres RDV" ON public.appointments;
CREATE POLICY "Utilisateurs voient leurs propres RDV"
  ON public.appointments FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Tout le monde peut créer un RDV" ON public.appointments;
CREATE POLICY "Tout le monde peut créer un RDV"
  ON public.appointments FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins peuvent modifier les RDV" ON public.appointments;
CREATE POLICY "Admins peuvent modifier les RDV"
  ON public.appointments FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===============================================
-- POLICIES pour contact_messages
-- ===============================================
DROP POLICY IF EXISTS "Admins voient tous les messages" ON public.contact_messages;
CREATE POLICY "Admins voient tous les messages"
  ON public.contact_messages FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Tout le monde peut envoyer un message" ON public.contact_messages;
CREATE POLICY "Tout le monde peut envoyer un message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- ===============================================
-- POLICIES pour documentation_purchases
-- ===============================================
DROP POLICY IF EXISTS "Utilisateurs voient leurs achats" ON public.documentation_purchases;
CREATE POLICY "Utilisateurs voient leurs achats"
  ON public.documentation_purchases FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Utilisateurs peuvent acheter" ON public.documentation_purchases;
CREATE POLICY "Utilisateurs peuvent acheter"
  ON public.documentation_purchases FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- ===============================================
-- POLICIES pour coworking_subscriptions
-- ===============================================
DROP POLICY IF EXISTS "Utilisateurs voient leurs abonnements" ON public.coworking_subscriptions;
CREATE POLICY "Utilisateurs voient leurs abonnements"
  ON public.coworking_subscriptions FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins gèrent les abonnements" ON public.coworking_subscriptions;
CREATE POLICY "Admins gèrent les abonnements"
  ON public.coworking_subscriptions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ===============================================
-- 9. VÉRIFICATIONS
-- ===============================================

-- Lister toutes les tables créées
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Vérifier les triggers
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- Vérifier les policies RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ===============================================
-- 10. DONNÉES DE TEST (Optionnel)
-- ===============================================

-- Insérer un profil admin de test (si pas déjà fait via /super-admin)
-- INSERT INTO public.profiles (id, email, first_name, last_name, role)
-- SELECT id, 'contact@andoh-dohgad.com', 'Super', 'Admin', 'admin'
-- FROM auth.users
-- WHERE email = 'contact@andoh-dohgad.com'
-- ON CONFLICT (id) DO NOTHING;

-- ===============================================
-- FIN DU SCHÉMA
-- ===============================================
-- Toutes les tables, triggers, functions et policies sont créés !
-- Les erreurs 500 devraient disparaître après l'exécution de ce script.
