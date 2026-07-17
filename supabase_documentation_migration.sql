-- ===============================================
-- MIGRATION DOCUMENTATION : Système Professionnel Complet
-- Date : 2026-07-17
-- ===============================================

-- ===============================================
-- 1. Ajouter les colonnes manquantes à documentation
-- ===============================================

ALTER TABLE public.documentation ADD COLUMN IF NOT EXISTS file_name TEXT;
ALTER TABLE public.documentation ADD COLUMN IF NOT EXISTS file_type TEXT;
ALTER TABLE public.documentation ADD COLUMN IF NOT EXISTS purchase_count INTEGER DEFAULT 0;
ALTER TABLE public.documentation ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Modifier file_url pour permettre NULL (documents en draft sans fichier)
ALTER TABLE public.documentation ALTER COLUMN file_url DROP NOT NULL;

-- Modifier status pour utiliser un ENUM au lieu de TEXT
ALTER TABLE public.documentation DROP CONSTRAINT IF EXISTS documentation_status_check;
ALTER TABLE public.documentation ADD CONSTRAINT documentation_status_check
CHECK (status IN ('draft', 'active', 'archived'));

-- ===============================================
-- 2. Vérifier/Créer la table documentation_translations
-- ===============================================

-- Vérifier si elle existe déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'documentation_translations'
  ) THEN
    -- Créer la table si elle n'existe pas
    CREATE TABLE public.documentation_translations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      doc_id UUID NOT NULL REFERENCES public.documentation(id) ON DELETE CASCADE,
      language TEXT NOT NULL CHECK (language IN ('fr', 'en', 'es')),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(doc_id, language)
    );

    -- Index pour améliorer les performances
    CREATE INDEX idx_doc_translations_doc_id ON public.documentation_translations(doc_id);
    CREATE INDEX idx_doc_translations_language ON public.documentation_translations(language);
  END IF;
END $$;

-- ===============================================
-- 3. Migrer les 8 documents statiques
-- ===============================================

-- Insérer les documents (sans fichier pour le moment)
INSERT INTO public.documentation (doc_type, price, status, download_count, purchase_count)
VALUES
  ('guides'::document_type, 5000, 'active', 0, 0),
  ('fiscaux'::document_type, 3500, 'active', 0, 0),
  ('modeles'::document_type, 7500, 'active', 0, 0),
  ('guides'::document_type, 5000, 'active', 0, 0),
  ('notes'::document_type, 2500, 'active', 0, 0),
  ('modeles'::document_type, 4000, 'active', 0, 0),
  ('fiscaux'::document_type, 4500, 'active', 0, 0),
  ('guides'::document_type, 3000, 'active', 0, 0)
ON CONFLICT (id) DO NOTHING
RETURNING id;

-- Insérer les traductions françaises (obligatoires)
DO $$
DECLARE
  doc_ids UUID[];
  doc_id UUID;
  i INTEGER := 1;
  titles TEXT[] := ARRAY[
    'Guide de la création d''entreprise en Côte d''Ivoire 2025',
    'Note fiscale : Réformes 2025 et impact sur les PME',
    'Modèle de business plan interactif',
    'Guide de la gestion de paie en Côte d''Ivoire',
    'Note juridique : Le contrat de travail ivoirien',
    'Pack modèles de documents comptables',
    'Note fiscale : L''optimisation fiscale légale',
    'Guide du statut juridique : SARL, SAS, EI'
  ];
  descriptions TEXT[] := ARRAY[
    'Toutes les étapes, les coûts et les délais pour créer votre entreprise.',
    'Analyse des nouvelles mesures fiscales et leurs implications pratiques.',
    'Un template Excel complet pour construire votre business plan.',
    'Les bases légales, les calculs et les déclarations CNPS.',
    'Types de contrats, clauses essentielles et obligations légales.',
    'Factures, bons de commande, bons de livraison et plus.',
    'Stratégies et mécanismes d''optimisation fiscale conformes.',
    'Comparez les statuts et choisissez celui qui vous convient.'
  ];
BEGIN
  -- Récupérer les IDs des 8 derniers documents insérés
  SELECT ARRAY_AGG(id ORDER BY created_at DESC)
  INTO doc_ids
  FROM public.documentation
  LIMIT 8;

  -- Insérer les traductions
  FOREACH doc_id IN ARRAY doc_ids
  LOOP
    INSERT INTO public.documentation_translations (doc_id, language, title, description)
    VALUES (doc_id, 'fr', titles[i], descriptions[i])
    ON CONFLICT (doc_id, language) DO NOTHING;

    i := i + 1;
  END LOOP;
END $$;

-- ===============================================
-- 4. Row Level Security (RLS)
-- ===============================================

-- Activer RLS sur documentation
ALTER TABLE public.documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentation_translations ENABLE ROW LEVEL SECURITY;

-- Policies pour documentation
DROP POLICY IF EXISTS "Anyone can view active documents" ON public.documentation;
CREATE POLICY "Anyone can view active documents"
  ON public.documentation FOR SELECT
  USING (status = 'active' OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage all documents" ON public.documentation;
CREATE POLICY "Admins can manage all documents"
  ON public.documentation FOR ALL
  USING (public.is_admin());

-- Policies pour documentation_translations
DROP POLICY IF EXISTS "Anyone can view active translations" ON public.documentation_translations;
CREATE POLICY "Anyone can view active translations"
  ON public.documentation_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.documentation d
      WHERE d.id = documentation_translations.doc_id
        AND (d.status = 'active' OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "Admins can manage translations" ON public.documentation_translations;
CREATE POLICY "Admins can manage translations"
  ON public.documentation_translations FOR ALL
  USING (public.is_admin());

-- ===============================================
-- 5. Configurer Supabase Storage
-- ===============================================

-- Créer le bucket 'documents' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  52428800, -- 50 MB max
  ARRAY['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Policies Storage : Admins peuvent upload/update/delete
DROP POLICY IF EXISTS "Admins can upload documents" ON storage.objects;
CREATE POLICY "Admins can upload documents"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'documents' AND
  public.is_admin()
);

DROP POLICY IF EXISTS "Admins can update documents" ON storage.objects;
CREATE POLICY "Admins can update documents"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'documents' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete documents" ON storage.objects;
CREATE POLICY "Admins can delete documents"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'documents' AND public.is_admin());

-- Policy Storage : Utilisateurs ayant payé peuvent télécharger
DROP POLICY IF EXISTS "Users can download purchased documents" ON storage.objects;
CREATE POLICY "Users can download purchased documents"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'documents' AND
  (
    public.is_admin() OR
    EXISTS (
      SELECT 1
      FROM documentation_purchases dp
      JOIN documentation d ON dp.doc_id = d.id
      WHERE dp.user_id = auth.uid()
        AND dp.payment_status = 'completed'::payment_status
        AND d.file_url = storage.objects.name
    )
  )
);

-- ===============================================
-- 6. Triggers pour updated_at
-- ===============================================

DROP TRIGGER IF EXISTS set_updated_at ON public.documentation;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.documentation
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON public.documentation_translations;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.documentation_translations
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ===============================================
-- 7. Fonction pour incrémenter purchase_count
-- ===============================================

CREATE OR REPLACE FUNCTION public.increment_document_purchase_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Incrémenter le compteur d'achats quand payment_status = 'completed'
  IF NEW.payment_status = 'completed'::payment_status AND
     (OLD.payment_status IS NULL OR OLD.payment_status != 'completed'::payment_status) THEN
    UPDATE public.documentation
    SET purchase_count = purchase_count + 1
    WHERE id = NEW.doc_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur documentation_purchases
DROP TRIGGER IF EXISTS increment_purchase_count ON public.documentation_purchases;
CREATE TRIGGER increment_purchase_count
AFTER INSERT OR UPDATE ON public.documentation_purchases
FOR EACH ROW EXECUTE FUNCTION public.increment_document_purchase_count();

-- ===============================================
-- 8. Index de performance
-- ===============================================

CREATE INDEX IF NOT EXISTS idx_documentation_status ON public.documentation(status);
CREATE INDEX IF NOT EXISTS idx_documentation_doc_type ON public.documentation(doc_type);
CREATE INDEX IF NOT EXISTS idx_documentation_created_at ON public.documentation(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documentation_purchase_count ON public.documentation(purchase_count DESC);

-- ===============================================
-- 9. VÉRIFICATIONS FINALES
-- ===============================================

-- Vérifier les colonnes de documentation
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'documentation'
ORDER BY ordinal_position;

-- Compter les documents migrés
SELECT
  'Total documents' AS metric,
  COUNT(*) AS value
FROM public.documentation

UNION ALL

SELECT
  'Traductions françaises',
  COUNT(*)
FROM public.documentation_translations
WHERE language = 'fr'

UNION ALL

SELECT
  'Documents actifs',
  COUNT(*)
FROM public.documentation
WHERE status = 'active';

-- Vérifier les policies
SELECT
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('documentation', 'documentation_translations')
ORDER BY tablename, policyname;

-- Vérifier le bucket Storage
SELECT id, name, public, file_size_limit
FROM storage.buckets
WHERE id = 'documents';

-- ===============================================
-- FIN DE LA MIGRATION
-- ===============================================
-- ✅ Table documentation mise à jour
-- ✅ 8 documents statiques migrés
-- ✅ Traductions françaises créées
-- ✅ RLS configuré
-- ✅ Supabase Storage configuré
-- ✅ Triggers en place
