# 🎨 GUIDE CMS - Système de Contenu Dynamique

## ✅ Ce qui a été créé

### 1. Base de données Supabase
**Table** : `cms_content`
- Stocke tout le contenu modifiable du site
- Sections : hero, stats, value_proposition, services_grid, etc.
- Champs : textes (JSONB), images (JSONB), active (boolean)

**Migration SQL** : `supabase/migrations/20260821000001_create_cms_content.sql`

### 2. Interface Admin
**Route** : `/admin/cms`
**Page** : `src/pages/admin/CMSEditor.tsx`

**Fonctionnalités** :
- ✅ Liste des sections (sidebar)
- ✅ Éditeur de textes (inputs / textareas)
- ✅ Éditeur d'images (URLs avec preview)
- ✅ Sauvegarde en temps réel
- ✅ Bouton "Prévisualiser" → ouvre le site

### 3. Hook React
**Fichier** : `src/hooks/useCMSContent.ts`

**Usage** :
```typescript
const { content, loading } = useCMSContent("hero");
```

### 4. Sections connectées
- ✅ **HeroSection** → Entièrement dynamique

---

## 📋 INSTRUCTIONS D'UTILISATION

### ÉTAPE 1 : Appliquer la migration SQL

1. Ouvrir Supabase Dashboard
2. Aller dans **SQL Editor**
3. Copier le contenu de `supabase/migrations/20260821000001_create_cms_content.sql`
4. Exécuter la requête
5. Vérifier que 7 lignes ont été insérées

### ÉTAPE 2 : Accéder à l'éditeur

1. Se connecter en tant qu'admin : `/super-admin`
2. Aller dans le menu : **Contenu Site**
3. Ou directement : `/admin/cms`

### ÉTAPE 3 : Modifier le contenu

1. **Sélectionner une section** (sidebar gauche)
2. **Modifier les textes** dans les champs
3. **Modifier les images** (URLs)
4. **Cliquer "Sauvegarder"**
5. **Actualiser le site** → changements visibles immédiatement

---

## 🔧 COMMENT CONNECTER UNE NOUVELLE SECTION

### Exemple : ValueProposition

```typescript
import { useCMSContent } from "@/hooks/useCMSContent";

export default function ValueProposition() {
  const { content, loading } = useCMSContent("value_proposition");
  
  if (loading) return <div>Chargement...</div>;
  
  const data = content?.content || {};
  const image = content?.images?.main || "/images/default.jpg";
  
  return (
    <section>
      <h2>{data.label}</h2>
      <h3>{data.title}</h3>
      <p>{data.description}</p>
      <img src={image} alt={data.imageAlt} />
    </section>
  );
}
```

---

## 📊 STRUCTURE DES DONNÉES

### Hero Section
```json
{
  "content": {
    "label": "Cabinet de Conseil Multidisciplinaire",
    "title": "Passer de la survie à la croissance",
    "subtitle": "...",
    "cta1": "Découvrir nos services",
    "cta2": "Prendre rendez-vous"
  },
  "images": {
    "background": "/images/hero-bg.jpg"
  }
}
```

### Stats Bar
```json
{
  "content": {
    "stats": [
      {"value": 200, "suffix": "+", "label": "Clients accompagnés"},
      {"value": 7, "suffix": "", "label": "Expertises métiers"},
      {"value": 10, "suffix": "", "label": "Années d'expérience"}
    ]
  }
}
```

---

## 🎯 PROCHAINES ÉTAPES

### Sections à connecter :
1. ✅ HeroSection (FAIT)
2. ⏳ StatsBar
3. ⏳ ValueProposition
4. ⏳ ServicesGrid
5. ⏳ Testimonials
6. ⏳ BlogPreview
7. ⏳ CTABanner

---

## 🚀 AVANTAGES

✅ **Aucun code à toucher** pour modifier le site
✅ **Interface visuelle** simple et intuitive
✅ **Prévisualisation** en temps réel
✅ **Historique** via Supabase
✅ **Multi-utilisateurs** (plusieurs admins)
✅ **Sécurisé** (RLS Supabase)

---

## 📝 NOTES TECHNIQUES

- **RLS activé** : seuls les admins peuvent modifier
- **Cache** : aucun (données fraîches à chaque chargement)
- **Images** : stockées dans `/public/images/` (pas d'upload pour l'instant)
- **Validation** : aucune (admin de confiance)

---

**Créé par Claude Sonnet 4.5**
