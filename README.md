# 🏢 Andoh & Dohgad Consulting - Site Web Complet

> **Site web professionnel avec frontend public + dashboard admin**  
> React 19 • TypeScript • Vite • Supabase • Stripe • Tailwind CSS

[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E.svg)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ⚠️ AVANT DE COMMENCER

### 🔴 Le projet nécessite une réparation

Si c'est la **première fois** que vous clonez/ouvrez ce projet, **lancez d'abord le script de réparation** :

```bash
# Rendre le script exécutable
chmod +x REPARER_PROJET.sh

# Lancer la réparation (3-5 minutes)
./REPARER_PROJET.sh
```

**Pourquoi ?** Le dossier `src/` a été supprimé. Le script restaure automatiquement la structure en fusionnant `webandoh/` et `new_andoh-dohgad/`.

📖 **Documentation complète** : [`DIAGNOSTIC_COMPLET.md`](DIAGNOSTIC_COMPLET.md) | [`SOLUTION_RAPIDE.md`](SOLUTION_RAPIDE.md)

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation rapide](#-installation-rapide)
- [Configuration](#-configuration)
- [Développement](#-développement)
- [Architecture](#-architecture)
- [Déploiement](#-déploiement)
- [Documentation](#-documentation)

---

## ✨ Fonctionnalités

### Frontend Public
- ✅ **14 pages** avec routing React Router v7
- ✅ **Animations GSAP** + ScrollTrigger pour effets de défilement
- ✅ **Multilingue** : Français, Anglais, Espagnol (i18next)
- ✅ **Formulaires** : Contact, Rendez-vous, Co-working (react-hook-form + Zod)
- ✅ **Design moderne** : Tailwind CSS + shadcn/ui (50+ composants)
- ✅ **Responsive** : Mobile, tablette, desktop
- ✅ **SEO optimisé** : Meta tags, sitemap

### Dashboard Admin
- ✅ **Authentification** : Supabase Auth (email/password + OAuth)
- ✅ **CMS dynamique** : Gestion services, blog, documentation
- ✅ **Upload d'images** : Supabase Storage
- ✅ **Éditeur Markdown** : Pour les articles de blog
- ✅ **Statistiques** : Dashboard avec métriques
- ✅ **Gestion utilisateurs** : Rôles (admin, client, visitor)
- ✅ **Logs d'audit** : Traçabilité des actions

### Backend (Supabase)
- ✅ **13 tables PostgreSQL** : Services, Blog, Documentation, Coworking, etc.
- ✅ **Row Level Security (RLS)** : Sécurité au niveau des lignes
- ✅ **Migrations SQL** : Scripts de création automatisés
- ✅ **Types TypeScript** : Générés automatiquement
- ✅ **Edge Functions** : API serverless

### Paiements
- ✅ **Stripe** : Paiements par carte bancaire
- ✅ **Orange Money** : Mobile Money (Côte d'Ivoire)
- ✅ **MTN Mobile Money** : Mobile Money (Côte d'Ivoire)

---

## 🛠️ Technologies

### Frontend
- **React 19.2** - Interface utilisateur
- **TypeScript 5.9** - Typage statique
- **Vite 7.2** - Build tool ultra-rapide
- **React Router 7** - Routing
- **Tailwind CSS 3.4** - Styles utilitaires
- **shadcn/ui** - Composants UI modernes
- **GSAP 3.15** - Animations avancées
- **Framer Motion 12** - Animations React
- **i18next** - Internationalisation

### Backend & Services
- **Supabase** - Base de données PostgreSQL + Auth + Storage
- **Stripe** - Paiements (test & production)
- **EmailJS** - Envoi d'emails
- **Orange Money API** - Paiements mobile
- **MTN Mobile Money API** - Paiements mobile

### Développement
- **ESLint** - Linting
- **React Hook Form** - Gestion de formulaires
- **Zod** - Validation de schémas
- **date-fns** - Manipulation de dates
- **Recharts** - Graphiques

---

## 🚀 Installation rapide

### Prérequis
- Node.js >= 18.x
- npm >= 9.x
- Git

### 1. Cloner le projet
```bash
git clone https://github.com/votre-username/andoh-dohgad.git
cd andoh-dohgad
```

### 2. Réparer la structure (OBLIGATOIRE)
```bash
chmod +x REPARER_PROJET.sh
./REPARER_PROJET.sh
```

### 3. Installer les dépendances
```bash
npm install
```

### 4. Configurer les variables d'environnement
```bash
# Le script a déjà créé .env.local
# Éditez-le pour ajouter vos vraies clés API
nano .env.local
```

### 5. Démarrer le serveur
```bash
npm run dev
```

🎉 **Le site est accessible sur** : http://localhost:3000

---

## ⚙️ Configuration

### Variables d'environnement (`.env.local`)

```env
# Supabase (OBLIGATOIRE)
VITE_SUPABASE_URL=https://tszsvbzfufglvdcsjzpo.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
SUPABASE_DB_PASSWORD=votre_mot_de_passe

# Stripe (pour paiements carte)
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# EmailJS (pour formulaires)
VITE_EMAILJS_SERVICE_ID=votre_service_id
VITE_EMAILJS_TEMPLATE_ID=votre_template_id
VITE_EMAILJS_PUBLIC_KEY=votre_public_key

# Orange Money (optionnel)
ORANGE_MONEY_MERCHANT_KEY=votre_key
ORANGE_MONEY_API_KEY=votre_key

# MTN Mobile Money (optionnel)
MTN_MOMO_SUBSCRIPTION_KEY=votre_key
MTN_MOMO_API_USER=votre_user
MTN_MOMO_API_KEY=votre_key
```

### Obtenir les clés API

#### Supabase
1. Aller sur https://supabase.com
2. Créer un projet
3. Aller dans **Settings → API**
4. Copier `Project URL` et `anon public` key

#### Stripe
1. Aller sur https://stripe.com
2. Créer un compte (mode test)
3. Aller dans **Developers → API keys**
4. Copier `Publishable key` et `Secret key`

#### EmailJS
1. Aller sur https://www.emailjs.com
2. Créer un compte
3. Créer un service email
4. Créer un template
5. Copier les IDs depuis le dashboard

---

## 💻 Développement

### Commandes principales

```bash
# Démarrer en mode développement (port 3000)
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview

# Linting
npm run lint

# Fix des erreurs de lint
npm run lint -- --fix
```

### Structure du projet (après réparation)

```
src/
├── components/           # Composants réutilisables
│   ├── layout/          # Header, Footer, Layout
│   ├── admin/           # Composants admin (Dashboard, etc.)
│   ├── auth/            # Login, Signup, ProtectedRoute
│   └── ui/              # shadcn/ui components (50+)
│
├── pages/               # Pages de l'application
│   ├── Home.tsx         # Page d'accueil
│   ├── Services.tsx     # Liste services
│   ├── Contact.tsx      # Formulaire contact
│   └── admin/           # Pages admin
│
├── sections/            # Sections réutilisables
│   ├── HeroSection.tsx
│   ├── StatsBar.tsx
│   └── ...
│
├── lib/                 # Bibliothèques et configs
│   ├── supabase/        # Client Supabase + types
│   ├── stripe/          # Client Stripe
│   ├── mobile-money/    # Orange + MTN
│   ├── i18n.ts          # Configuration i18next
│   └── utils.ts         # Fonctions utilitaires
│
├── contexts/            # Contextes React
│   └── AuthContext.tsx  # Gestion authentification
│
├── data/                # Données statiques
│   ├── services.ts
│   ├── blog.ts
│   └── testimonials.ts
│
├── hooks/               # Custom hooks
│   ├── useScrollAnimation.ts
│   └── useMediaQuery.ts
│
├── types/               # Types TypeScript
│   └── index.ts
│
├── App.tsx              # Routes principales
└── main.tsx             # Point d'entrée
```

### Routes disponibles

#### Public
- `/` - Accueil
- `/a-propos` - À propos
- `/services` - Liste des services
- `/services/:slug` - Détail d'un service
- `/solutions` - Solutions digitales
- `/documentation` - Documentation téléchargeable
- `/blog` - Liste des articles
- `/blog/:slug` - Article détaillé
- `/contact` - Formulaire de contact
- `/rendez-vous` - Prise de rendez-vous
- `/co-working` - Espaces de co-working
- `/sondages` - Sondages

#### Authentification
- `/login` - Connexion
- `/signup` - Inscription

#### Admin (protégé)
- `/admin/dashboard` - Tableau de bord
- `/admin/services` - Gestion des services
- `/admin/blog` - Gestion du blog
- `/admin/users` - Gestion des utilisateurs
- `/admin/documentation` - Gestion de la documentation
- `/admin/coworking` - Gestion co-working
- `/admin/appointments` - Gestion rendez-vous
- `/admin/surveys` - Gestion sondages
- `/admin/settings` - Paramètres

---

## 🗄️ Base de données (Supabase)

### Migrations

Les migrations SQL sont dans `supabase/migrations/`. Exécutez-les dans l'ordre :

```sql
-- 1. Profils utilisateurs
supabase/migrations/001_create_profiles.sql

-- 2. Services
supabase/migrations/002_create_services.sql

-- 3. Blog
supabase/migrations/003_create_blog.sql

-- ... (13 migrations au total)
```

### Créer un compte admin

Après avoir exécuté les migrations, créez un admin :

```sql
-- Voir supabase/SETUP_ADMIN.sql pour le script complet
```

### Rôles utilisateur

- `admin` - Accès complet au dashboard
- `coworking_client` - Réservations co-working
- `standard_client` - Achats documentation
- `visitor` - Formulaires publics uniquement

---

## 🚢 Déploiement

### Vercel (recommandé)

1. **Installer Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Déployer**
   ```bash
   # Preview deployment
   vercel
   
   # Production deployment
   vercel --prod
   ```

4. **Configurer les variables d'environnement**
   - Aller sur le dashboard Vercel
   - Settings → Environment Variables
   - Ajouter toutes les variables de `.env.local`

### Netlify

1. Connecter le repo GitHub
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Ajouter les variables d'environnement

---

## 📚 Documentation

- [`DIAGNOSTIC_COMPLET.md`](DIAGNOSTIC_COMPLET.md) - Analyse complète du projet
- [`SOLUTION_RAPIDE.md`](SOLUTION_RAPIDE.md) - Guide de réparation rapide
- [`COMPARATIF_AVANT_APRES.md`](COMPARATIF_AVANT_APRES.md) - Structure avant/après
- [`COMMANDES_ESSENTIELLES.md`](COMMANDES_ESSENTIELLES.md) - Commandes utiles
- [`CLAUDE.md`](CLAUDE.md) - Documentation pour Claude Code
- [`new_andoh-dohgad/BACKEND_README.md`](new_andoh-dohgad/BACKEND_README.md) - Documentation backend (avant fusion)

---

## 🐛 Dépannage

### Le serveur ne démarre pas

```bash
# 1. Vérifier que src/ existe
ls src/

# 2. Si absent, relancer la réparation
./REPARER_PROJET.sh

# 3. Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erreur "Cannot find module"

```bash
# Vérifier la structure
test -f src/App.tsx && echo "OK" || echo "ERREUR: Lancer REPARER_PROJET.sh"

# Vérifier les alias TypeScript
cat tsconfig.json | grep "@"
```

### Port 3000 déjà utilisé

```bash
# Tuer le processus
lsof -ti:3000 | xargs kill -9

# Ou changer le port dans vite.config.ts
```

Voir [`COMMANDES_ESSENTIELLES.md`](COMMANDES_ESSENTIELLES.md) pour plus de solutions.

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir [`LICENSE`](LICENSE) pour plus de détails.

---

## 👥 Auteurs

- **Andoh & Dohgad Consulting** - [Site web](https://andoh-dohgad.com)
- **Email** : andoh.dohgad@gmail.com

---

## 🙏 Remerciements

- React Team
- Vercel (Vite)
- Supabase Team
- shadcn/ui
- GSAP Team
- Communauté open-source

---

## 📊 Statistiques

- **Lignes de code** : ~15,000+
- **Composants** : 80+
- **Pages** : 14 publiques + 10 admin
- **Langues** : 3 (FR, EN, ES)
- **Tables DB** : 13

---

**Made with ❤️ by Andoh & Dohgad Consulting**

---

## 🔗 Liens utiles

- [Documentation React](https://react.dev)
- [Documentation Vite](https://vitejs.dev)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Stripe](https://stripe.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [GSAP](https://greensock.com/gsap/)
- [Tailwind CSS](https://tailwindcss.com)
