# 🎨 GUIDE CMS - Système de Contenu Dynamique

## ✅ ÉTAPE 1 : APPLIQUER LA MIGRATION SQL

### Instructions :

1. Ouvrir **Supabase Dashboard** : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo
2. Aller dans **SQL Editor** (menu gauche)
3. Cliquer sur **New Query**
4. **Copier-coller TOUT le SQL ci-dessous**
5. Cliquer sur **RUN**
6. ✅ Vérifier que 7 lignes ont été insérées

---

### 📝 MIGRATION SQL COMPLÈTE (COPIER-COLLER) :

```sql
-- =====================================================
-- TABLE CMS CONTENT - Contenu dynamique du site
-- =====================================================

CREATE TABLE IF NOT EXISTS public.cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  images JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cms_section_key ON public.cms_content(section_key);
CREATE INDEX idx_cms_active ON public.cms_content(active);

ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active content"
  ON public.cms_content
  FOR SELECT
  USING (active = true);

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

-- Hero Section
INSERT INTO public.cms_content (section_key, content, images) VALUES
('hero', 
  '{"label": "Cabinet de Conseil Multidisciplinaire", "title": "Passer de la survie à la croissance", "subtitle": "Andoh & Dohgad Consulting accompagne les entrepreneurs ivoiriens dans la structuration, la gestion et la croissance de leurs entreprises.", "cta1": "Découvrir nos services", "cta2": "Prendre rendez-vous"}'::jsonb,
  '{"background": "/images/hero-background.jpg"}'::jsonb
);

-- Stats Bar
INSERT INTO public.cms_content (section_key, content) VALUES
('stats',
  '{"stats": [{"value": 200, "suffix": "+", "label": "Clients accompagnés"}, {"value": 7, "suffix": "", "label": "Expertises métiers"}, {"value": 10, "suffix": "", "label": "Années d''expérience"}]}'::jsonb
);

-- Value Proposition
INSERT INTO public.cms_content (section_key, content, images) VALUES
('value_proposition',
  '{"label": "NOTRE PHILOSOPHIE", "title": "La clarté financière permet de transformer les opportunités en décisions maîtrisées", "quote": "Grandir sans visibilité est un risque.", "description": "Chez Andoh & Dohgad Consulting, nous croyons que chaque entrepreneur mérite une vision claire de sa situation financière et stratégique. Notre mission est de vous offrir les outils et l''expertise nécessaires pour passer de la simple survie à une croissance maîtrisée et durable.", "cta": "Découvrir notre approche"}'::jsonb,
  '{"main": "/images/value-proposition.jpg"}'::jsonb
);

-- Services Grid
INSERT INTO public.cms_content (section_key, content) VALUES
('services_grid',
  '{"label": "NOS SERVICES", "title": "Un accompagnement complet pour votre entreprise", "cta": "Demander un service"}'::jsonb
);

-- Testimonials
INSERT INTO public.cms_content (section_key, content) VALUES
('testimonials',
  '{"label": "ILS NOUS FONT CONFIANCE", "title": "Ce que nos clients disent de nous"}'::jsonb
);

-- Blog Preview
INSERT INTO public.cms_content (section_key, content) VALUES
('blog_preview',
  '{"label": "NOTRE BLOG", "title": "Dernières actualités et conseils", "seeAll": "Voir tous les articles"}'::jsonb
);

-- CTA Banner
INSERT INTO public.cms_content (section_key, content) VALUES
('cta_banner',
  '{"title": "Prêt à structurer votre entreprise et accélérer votre croissance ?", "button": "Nous contacter"}'::jsonb
);

-- Trigger auto-update
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

-- Vérification
SELECT section_key, content->>'title' as title, active
FROM public.cms_content
ORDER BY section_key;
```

---

## ✅ ÉTAPE 2 : ACCÉDER À L'ÉDITEUR

1. Se connecter : `/super-admin`
2. Menu admin : **Contenu Site**
3. Ou direct : `/admin/cms`

---

## ✅ ÉTAPE 3 : MODIFIER LE CONTENU

1. **Choisir une section** (sidebar)
2. **Modifier les textes**
3. **Modifier les images** (URL)
4. **Cliquer "Sauvegarder"**
5. **Actualiser le site** → changements visibles !

---

## 🔧 CONNECTER UNE NOUVELLE SECTION

```typescript
import { useCMSContent } from "@/hooks/useCMSContent";

export default function MaSection() {
  const { content, loading } = useCMSContent("ma_section");
  
  if (loading) return <div>Chargement...</div>;
  
  const data = content?.content || {};
  const image = content?.images?.main || "/default.jpg";
  
  return (
    <section>
      <h2>{data.title}</h2>
      <p>{data.description}</p>
      <img src={image} alt="Image" />
    </section>
  );
}
```

---

## 📊 EXEMPLE DE DONNÉES

```json
{
  "section_key": "hero",
  "content": {
    "title": "Mon titre",
    "subtitle": "Mon sous-titre"
  },
  "images": {
    "background": "/images/bg.jpg"
  }
}
```

---

## 🎯 SECTIONS DISPONIBLES

1. ✅ **hero** - Hero Section (connectée)
2. ⏳ **stats** - Statistiques
3. ⏳ **value_proposition** - Proposition de valeur
4. ⏳ **services_grid** - Grille services
5. ⏳ **testimonials** - Témoignages
6. ⏳ **blog_preview** - Aperçu blog
7. ⏳ **cta_banner** - Bannière CTA

---

## 🚀 AVANTAGES

✅ Modification sans code
✅ Interface visuelle
✅ Changements instantanés
✅ Multi-admins
✅ Sécurisé (RLS)
✅ Historique automatique

---

## ❓ FAQ

**Q: Erreur "syntax error at or near" ?**
R: Les apostrophes sont déjà échappées (d''). Copiez le SQL tel quel.

**Q: Comment ajouter une image ?**
R: Mettre l'image dans `/public/images/` puis écrire `/images/nom.jpg` dans l'éditeur.

**Q: Les changements ne s'affichent pas ?**
R: Actualisez le navigateur avec Ctrl+Shift+R (hard reload).

---

**Créé par Claude Sonnet 4.5**
