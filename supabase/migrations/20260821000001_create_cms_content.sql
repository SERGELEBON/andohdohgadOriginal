-- =====================================================
-- TABLE CMS CONTENT - Contenu dynamique du site
-- =====================================================

CREATE TABLE IF NOT EXISTS public.cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE, -- 'hero', 'stats', 'value_proposition', etc.
  content JSONB NOT NULL DEFAULT '{}'::jsonb, -- Textes et données structurées
  images JSONB DEFAULT '{}'::jsonb, -- URLs des images
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_cms_section_key ON public.cms_content(section_key);
CREATE INDEX idx_cms_active ON public.cms_content(active);

-- RLS Policies
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire le contenu actif
CREATE POLICY "Public can view active content"
  ON public.cms_content
  FOR SELECT
  USING (active = true);

-- Seuls les admins peuvent modifier
CREATE POLICY "Admins can manage content"
  ON public.cms_content
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- DONNÉES INITIALES - Contenu actuel du site
-- =====================================================

-- Hero Section
INSERT INTO public.cms_content (section_key, content, images) VALUES
('hero', 
  '{
    "label": "Cabinet de Conseil Multidisciplinaire",
    "title": "Passer de la survie à la croissance",
    "subtitle": "Andoh & Dohgad Consulting accompagne les entrepreneurs ivoiriens dans la structuration, la gestion et la croissance de leurs entreprises.",
    "cta1": "Découvrir nos services",
    "cta2": "Prendre rendez-vous"
  }'::jsonb,
  '{
    "background": "/images/hero-bg.jpg"
  }'::jsonb
);

-- Stats Bar
INSERT INTO public.cms_content (section_key, content) VALUES
('stats',
  '{
    "stats": [
      {"value": 200, "suffix": "+", "label": "Clients accompagnés"},
      {"value": 7, "suffix": "", "label": "Expertises métiers"},
      {"value": 10, "suffix": "", "label": "Années d'\''expérience"}
    ]
  }'::jsonb
);

-- Value Proposition
INSERT INTO public.cms_content (section_key, content, images) VALUES
('value_proposition',
  '{
    "label": "NOTRE PHILOSOPHIE",
    "title": "La clarté financière permet de transformer les opportunités en décisions maîtrisées",
    "quote": "Grandir sans visibilité est un risque.",
    "description": "Chez Andoh & Dohgad Consulting, nous croyons que chaque entrepreneur mérite une vision claire de sa situation financière et stratégique. Notre mission est de vous offrir les outils et l'\''expertise nécessaires pour passer de la simple survie à une croissance maîtrisée et durable.",
    "cta": "Découvrir notre approche"
  }'::jsonb,
  '{
    "main": "/images/value-proposition.jpg"
  }'::jsonb
);

-- Services Grid
INSERT INTO public.cms_content (section_key, content) VALUES
('services_grid',
  '{
    "label": "NOS SERVICES",
    "title": "Un accompagnement complet pour votre entreprise",
    "cta": "Demander un service"
  }'::jsonb
);

-- Testimonials
INSERT INTO public.cms_content (section_key, content) VALUES
('testimonials',
  '{
    "label": "ILS NOUS FONT CONFIANCE",
    "title": "Ce que nos clients disent de nous"
  }'::jsonb
);

-- Blog Preview
INSERT INTO public.cms_content (section_key, content) VALUES
('blog_preview',
  '{
    "label": "NOTRE BLOG",
    "title": "Dernières actualités et conseils",
    "seeAll": "Voir tous les articles"
  }'::jsonb
);

-- CTA Banner
INSERT INTO public.cms_content (section_key, content) VALUES
('cta_banner',
  '{
    "title": "Prêt à structurer votre entreprise et accélérer votre croissance ?",
    "button": "Nous contacter"
  }'::jsonb
);

-- =====================================================
-- TRIGGER AUTO-UPDATE timestamp
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
SELECT section_key, content->>'title' as title, active
FROM public.cms_content
ORDER BY section_key;
