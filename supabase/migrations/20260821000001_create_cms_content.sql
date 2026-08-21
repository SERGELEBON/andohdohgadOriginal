-- =====================================================
-- NETTOYAGE COMPLET - Supprime TOUT ce qui existe
-- =====================================================

-- Supprimer les triggers
DROP TRIGGER IF EXISTS cms_content_updated_at ON public.cms_content;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS update_cms_updated_at();

-- Supprimer les index (explicitement)
DROP INDEX IF EXISTS public.idx_cms_section_key;
DROP INDEX IF EXISTS public.idx_cms_active;

-- Supprimer la table (CASCADE supprime les policies)
DROP TABLE IF EXISTS public.cms_content CASCADE;

-- =====================================================
-- CRÉATION PROPRE
-- =====================================================

CREATE TABLE public.cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  images JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_cms_section_key ON public.cms_content(section_key);
CREATE INDEX idx_cms_active ON public.cms_content(active);

-- RLS
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active content"
  ON public.cms_content FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage content"
  ON public.cms_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- DONNÉES INITIALES
-- =====================================================

INSERT INTO public.cms_content (section_key, content, images) VALUES
('hero', 
  '{"label": "Cabinet de Conseil Multidisciplinaire", "title": "Passer de la survie à la croissance", "subtitle": "Andoh & Dohgad Consulting accompagne les entrepreneurs ivoiriens dans la structuration, la gestion et la croissance de leurs entreprises.", "cta1": "Découvrir nos services", "cta2": "Prendre rendez-vous"}'::jsonb,
  '{"background": "/images/hero-background.jpg"}'::jsonb
),
('stats',
  '{"stats": [{"value": 200, "suffix": "+", "label": "Clients accompagnés"}, {"value": 7, "suffix": "", "label": "Expertises métiers"}, {"value": 10, "suffix": "", "label": "Années d''expérience"}]}'::jsonb,
  '{}'::jsonb
),
('value_proposition',
  '{"label": "NOTRE PHILOSOPHIE", "title": "La clarté financière permet de transformer les opportunités en décisions maîtrisées", "quote": "Grandir sans visibilité est un risque.", "description": "Chez Andoh & Dohgad Consulting, nous croyons que chaque entrepreneur mérite une vision claire de sa situation financière et stratégique. Notre mission est de vous offrir les outils et l''expertise nécessaires pour passer de la simple survie à une croissance maîtrisée et durable.", "cta": "Découvrir notre approche"}'::jsonb,
  '{"main": "/images/value-proposition.jpg"}'::jsonb
),
('services_grid',
  '{"label": "NOS SERVICES", "title": "Un accompagnement complet pour votre entreprise", "cta": "Demander un service"}'::jsonb,
  '{}'::jsonb
),
('testimonials',
  '{"label": "ILS NOUS FONT CONFIANCE", "title": "Ce que nos clients disent de nous"}'::jsonb,
  '{}'::jsonb
),
('blog_preview',
  '{"label": "NOTRE BLOG", "title": "Dernières actualités et conseils", "seeAll": "Voir tous les articles"}'::jsonb,
  '{}'::jsonb
),
('cta_banner',
  '{"title": "Prêt à structurer votre entreprise et accélérer votre croissance ?", "button": "Nous contacter"}'::jsonb,
  '{}'::jsonb
);

-- =====================================================
-- TRIGGER AUTO-UPDATE
-- =====================================================

CREATE OR REPLACE FUNCTION update_cms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cms_content_updated_at
  BEFORE UPDATE ON public.cms_content
  FOR EACH ROW
  EXECUTE FUNCTION update_cms_updated_at();

-- =====================================================
-- VÉRIFICATION
-- =====================================================

SELECT 
  section_key, 
  content->>'title' as title, 
  active,
  created_at
FROM public.cms_content 
ORDER BY section_key;
