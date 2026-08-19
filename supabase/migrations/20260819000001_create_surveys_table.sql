-- ===============================================
-- MIGRATION: Création de la table surveys
-- Date: 2026-08-19
-- ===============================================

-- Supprimer la table si elle existe déjà (pour réinitialisation complète)
DROP TABLE IF EXISTS public.surveys CASCADE;

-- Créer la table surveys
CREATE TABLE public.surveys (
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

-- Index
CREATE INDEX idx_surveys_survey_type ON public.surveys(survey_type);
CREATE INDEX idx_surveys_email ON public.surveys(email);
CREATE INDEX idx_surveys_status ON public.surveys(status);
CREATE INDEX idx_surveys_created_at ON public.surveys(created_at DESC);
CREATE INDEX idx_surveys_assigned_to ON public.surveys(assigned_to);

-- RLS
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

-- Policy 1: Insertion publique
CREATE POLICY "surveys_insert_policy"
    ON public.surveys
    FOR INSERT
    WITH CHECK (true);

-- Policy 2: Admins peuvent tout voir
CREATE POLICY "surveys_select_admin_policy"
    ON public.surveys
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy 3: Admins peuvent tout modifier
CREATE POLICY "surveys_update_admin_policy"
    ON public.surveys
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy 4: Admins peuvent supprimer
CREATE POLICY "surveys_delete_admin_policy"
    ON public.surveys
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Trigger auto-update
CREATE OR REPLACE FUNCTION public.update_surveys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_surveys_updated_at
    BEFORE UPDATE ON public.surveys
    FOR EACH ROW
    EXECUTE FUNCTION public.update_surveys_updated_at();