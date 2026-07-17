-- ===============================================
-- MIGRATION DOCUMENTATION : Système Professionnel Complet
-- Version 3 (Final) - Date : 2026-07-17
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
-- 3. Migrer les 8 documents statiques (VERSION ATOMIQUE)
-- ===============================================

DO $$
DECLARE
  doc1_id UUID;
  doc2_id UUID;
  doc3_id UUID;
  doc4_id UUID;
  doc5_id UUID;
  doc6_id UUID;
  doc7_id UUID;
  doc8_id UUID;
BEGIN
  -- Insérer document 1
  INSERT INTO public.documentation (doc_type, price, status, download_count, purchase_count)
  VALUES ('guides'::document_type, 5000, 'active', 0, 0)
  RETURNING id INTO doc1_id;

  INSERT INTO public.documentation_translations (doc_id, language, title, description)
  VALUES (doc1_id, 'fr', 'Guide de la création d''entreprise en Côte d''Ivoire 2025', 'Toutes les étapes, les coûts et les délais pour créer votre entreprise.')
  ON CONFLICT (doc_id, language) DO NOTHING;

  -- Insérer document 2
  INSERT INTO public.documentation (doc_type, price, status, download_count, purchase_count)
  VALUES ('fiscaux'::document_type, 3500, 'active', 0, 0)
  RETURNING id INTO doc2_id;

  INSERT INTO public.documentation_translations (doc_id, language, title, description)
  VALUES (doc2_id, 'fr', 'Note fiscale : Réformes 2025 et impact sur les PME', 'Analyse des nouvelles mesures fiscales et leurs implications pratiques.')
  ON CONFLICT (doc_id, language) DO NOTHING;

  -- Insérer document 3
  INSERT INTO public.documentation (doc_type, price, status, download_count, purchase_count)
  VALUES ('modeles'::document_type, 7500, 'active', 0, 0)
  RETURNING id INTO doc3_id;

  INSERT INTO public.documentation_translations (doc_id, language, title, description)
  VALUES (doc3_id, 'fr', 'Modèle de business plan interactif', 'Un template Excel complet pour construire votre business plan.')
  ON CONFLICT (doc_id, language) DO NOTHING;

  -- Insérer document 4
  INSERT INTO public.documentation (doc_type, price, status, download_count, purchase_count)
  VALUES ('guides'::document_type, 5000, 'active', 0, 0)
  RETURNING id INTO doc4_id;

  INSERT INTO public.documentation_translations (doc_id, language, title, description)
  VALUES (doc4_id, 'fr', 'Guide de la gestion de paie en Côte d''Ivoire', 'Les bases légales, les calculs et les déclarations CNPS.')
  ON CONFLICT (doc_id, language) DO NOTHING;

  -- Insérer document 5
  INSERT INTO public.documentation (doc_type, price, status, download_count, purchase_count)
  VALUES ('notes'::document_type, 2500, 'active', 0, 0)
  RETURNING id INTO doc5_id;

  INSERT INTO public.documentation_translations (doc_id, language, title, description)
  VALUES (doc5_id, 'fr', 'Note juridique : Le contrat de travail ivoirien', 'Types de contrats, clauses essentielles et obligations légales.')
  ON CONFLICT (doc_id, language) DO NOTHING;

  -- Insérer document 6
  INSERT INTO public.documentation (doc_type, price, status, download_count, purchase_count)
  VALUES ('modeles'::document_type, 4000, 'active', 0, 0)
  RETURNING id INTO doc6_id;

  INSERT INTO public.documentation_translations (doc_id, language, title, description)
  VALUES (doc6_id, 'fr', 'Pack modèles de documents comptables', 'Factures, bons de commande, bons de livraison et plus.')
  ON CONFLICT (doc_id, language) DO NOTHING;

  -- Insérer document 7
  INSERT INTO public.documentation (doc_type, price, status, download_count, purchase_count)
  VALUES ('fiscaux'::document_type, 4500, 'active', 0, 0)
  RETURNING id INTO doc7_id;

  INSERT INTO public.documentation_translations (doc_id, language, title, description)
  VALUES (doc7_id, 'fr', 'Note fiscale : L''optimisation fiscale légale', 'Stratégies et mécanismes d''optimisation fiscale conformes.')
  ON CONFLICT (doc_id, language) DO NOTHING;

  -- Insérer document 8
  INSERT INTO public.documentation (doc_type, price, status, download_count, purchase_count)
  VALUES ('guides'::document_type, 3000, 'active', 0, 0)
  RETURNING id INTO doc8_id;

  INSERT INTO public.documentation_translations (doc_id, language, title, description)
  VALUES (doc8_id, 'fr', 'Guide du statut juridique : SARL, SAS, EI', 'Comparez les statuts et choisissez celui qui vous convient.')
  ON CONFLICT (doc_id, language) DO NOTHING;

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

-- Afficher les 8 derniers documents avec leurs traductions
SELECT
  d.id,
  d.doc_type,
  d.price,
  d.status,
  dt.title,
  dt.description
FROM public.documentation d
LEFT JOIN public.documentation_translations dt ON d.id = dt.doc_id AND dt.language = 'fr'
ORDER BY d.created_at DESC
LIMIT 8;

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
-- FIN DE LA MIGRATION V3
-- ===============================================
-- ✅ Table documentation mise à jour
-- ✅ 8 documents statiques migrés avec RETURNING
-- ✅ Traductions françaises créées atomiquement
-- ✅ RLS configuré
-- ✅ Supabase Storage configuré
-- ✅ Triggers en place
