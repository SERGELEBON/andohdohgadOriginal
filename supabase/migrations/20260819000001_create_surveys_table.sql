-- ===============================================
-- MIGRATION: Création de la table surveys
-- Date: 2026-08-19
-- Description: Table pour stocker les formulaires de sondages (création d'entreprise, RH, etc.)
-- ===============================================

-- Créer la table surveys si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_type TEXT NOT NULL CHECK (survey_type IN ('creation', 'service', 'rh', 'domiciliation', 'coworking')),
    form_data JSONB NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    assigned_to UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer les index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_surveys_survey_type ON public.surveys(survey_type);
CREATE INDEX IF NOT EXISTS idx_surveys_email ON public.surveys(email);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON public.surveys(status);
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON public.surveys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_surveys_assigned_to ON public.surveys(assigned_to);

-- Activer Row Level Security
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent créer leur propre survey (public)
CREATE POLICY "Anyone can insert surveys"
    ON public.surveys
    FOR INSERT
    WITH CHECK (true);

-- Policy: Les utilisateurs peuvent voir leurs propres surveys (via profiles.email)
CREATE POLICY "Users can view own surveys"
    ON public.surveys
    FOR SELECT
    USING (
        -- Comparaison avec l'email du profil de l'utilisateur connecté
        email = (
            SELECT p.email
            FROM public.profiles p
            WHERE p.id = auth.uid()
        )
    );

-- Policy: Les admins peuvent tout voir
CREATE POLICY "Admins can view all surveys"
    ON public.surveys
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy: Les admins peuvent tout modifier
CREATE POLICY "Admins can update all surveys"
    ON public.surveys
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy: Les admins peuvent supprimer
CREATE POLICY "Admins can delete surveys"
    ON public.surveys
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.update_surveys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_surveys_updated_at ON public.surveys;

CREATE TRIGGER update_surveys_updated_at
    BEFORE UPDATE ON public.surveys
    FOR EACH ROW
    EXECUTE FUNCTION public.update_surveys_updated_at();

-- Commentaires pour documentation
COMMENT ON TABLE public.surveys IS 'Formulaires de sondages et demandes clients (création entreprise, RH, domiciliation, etc.)';
COMMENT ON COLUMN public.surveys.survey_type IS 'Type de formulaire: creation, service, rh, domiciliation, coworking';
COMMENT ON COLUMN public.surveys.form_data IS 'Données du formulaire en JSON';
COMMENT ON COLUMN public.surveys.status IS 'Statut du traitement: pending, in_progress, completed, cancelled';
COMMENT ON COLUMN public.surveys.assigned_to IS 'ID de l''admin assigné au traitement';

-- ===============================================
-- VÉRIFICATION FINALE
-- ===============================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════';
    RAISE NOTICE '✅ TABLE SURVEYS CRÉÉE AVEC SUCCÈS';
    RAISE NOTICE '═══════════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE 'Table: public.surveys';
    RAISE NOTICE 'RLS: ENABLED';
    RAISE NOTICE 'Policies: 5 (insert, select user, select admin, update admin, delete admin)';
    RAISE NOTICE 'Indexes: 5 (survey_type, email, status, created_at, assigned_to)';
    RAISE NOTICE 'Trigger: update_surveys_updated_at';
    RAISE NOTICE '';
    RAISE NOTICE '📋 PROCHAINES ÉTAPES:';
    RAISE NOTICE '1. Tester le formulaire sur http://localhost:3000/sondages';
    RAISE NOTICE '2. Vérifier les données dans Table Editor > surveys';
    RAISE NOTICE '3. Vérifier la réception des emails';
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════';
END $$;

-- ===============================================
-- DONNÉES DE TEST (optionnel, à supprimer en production)
-- ===============================================

-- Décommenter pour créer un survey de test
-- INSERT INTO public.surveys (survey_type, form_data, email, name, phone, status)
-- VALUES (
--     'creation',
--     '{
--         "companyName": "Test SARL",
--         "structure": "SARL",
--         "sector": "Commerce",
--         "description": "Test de création d''entreprise"
--     }'::jsonb,
--     'test@example.com',
--     'Test User',
--     '+225 07 00 00 00 00',
--     'pending'
-- );