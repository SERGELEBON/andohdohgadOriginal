# 🔍 DIAGNOSTIC COMPLET DU PROJET ANDOH & DOHGAD

**Date**: 14 juillet 2026  
**Statut**: ❌ PROJET NON FONCTIONNEL - STRUCTURE CASSÉE

---

## 📊 RÉSUMÉ EXÉCUTIF

Le projet est **actuellement non fonctionnel** pour les raisons suivantes:

1. ✅ **BACKEND** : Existe et est complet dans `/new_andoh-dohgad/`
2. ✅ **FRONTEND** : Existe dans `/webandoh/`
3. ❌ **PROBLÈME CRITIQUE** : Le dossier `/src/` à la racine a été **supprimé** (git status montre tous les fichiers en `D`)
4. ❌ **INCOHÉRENCE** : `vite.config.ts` à la racine pointe vers `./src` qui n'existe plus
5. ❌ **DÉPENDANCES** : Non installées (`UNMET DEPENDENCY` pour Supabase, Stripe, etc.)
6. ❌ **CONFIGURATION** : Aucun fichier `.env` ou `.env.local` à la racine

---

## 🗂️ STRUCTURE ACTUELLE

```
/home/serge/Téléchargements/dohgahnew/
│
├── 📁 new_andoh-dohgad/         (2.3 MB - PROJET BACKEND COMPLET)
│   ├── src/                      Backend avec composants admin
│   │   ├── components/           Composants admin (auth, dashboard)
│   │   ├── contexts/             AuthContext, etc.
│   │   ├── lib/                  
│   │   │   ├── supabase/         ✅ Client Supabase + types
│   │   │   ├── stripe/           ✅ Configuration Stripe
│   │   │   └── mobile-money/     ✅ Orange Money + MTN
│   │   └── pages/                Pages admin
│   ├── supabase/                 ✅ Migrations SQL complètes
│   │   ├── migrations/           Scripts de création de tables
│   │   └── seed/                 Données initiales
│   ├── .env.local                ✅ Configuration Supabase (partielle)
│   └── [Documentation MD]        ARCHITECTURE.md, BACKEND_README.md
│
├── 📁 webandoh/                  (776 KB - FRONTEND PUBLIC)
│   ├── App.tsx                   Routes publiques
│   ├── main.tsx                  Point d'entrée React
│   ├── components/               
│   │   ├── layout/               Header, Footer, Layout
│   │   └── ui/                   shadcn/ui components
│   ├── sections/                 HeroSection, StatsBar, etc.
│   ├── pages/                    Pages publiques
│   ├── data/                     services.ts, blog.ts, etc.
│   ├── hooks/                    Custom hooks
│   └── lib/                      i18n, utils
│
├── ❌ src/                       SUPPRIMÉ (git status: D)
│   └── [Tous les fichiers supprimés]
│
├── 📄 Configuration racine
│   ├── package.json              ✅ Dépendances définies
│   ├── vite.config.ts            ❌ Pointe vers ./src qui n'existe plus
│   ├── tsconfig.json             ❌ Alias @/ vers ./src cassé
│   ├── CLAUDE.md                 Documentation projet
│   └── .env                      ❌ N'EXISTE PAS
│
└── 📁 public/                    Ressources statiques
```

---

## 🔴 PROBLÈMES IDENTIFIÉS

### 1. **STRUCTURE CASSÉE**
- Le dossier `/src/` mentionné dans `vite.config.ts` et `CLAUDE.md` **n'existe plus**
- Git montre 200+ fichiers supprimés (D) dans `src/`
- Les chemins d'alias TypeScript (`@/*`) ne fonctionnent plus

### 2. **DUPLICATION ET CONFUSION**
- **2 versions du projet** existent simultanément:
  - `new_andoh-dohgad/` : Version BACKEND avec admin
  - `webandoh/` : Version FRONTEND public seulement
- **Aucune intégration** entre les deux
- **3 dépôts Git différents** (racine + new_andoh-dohgad + webandoh?)

### 3. **DÉPENDANCES NON INSTALLÉES**
```
UNMET DEPENDENCY:
- @stripe/stripe-js@^9.9.0
- @supabase/auth-helpers-react@^0.15.0
- @supabase/supabase-js@^2.109.0
- stripe@^22.3.0
```

### 4. **CONFIGURATION MANQUANTE**
- ❌ Pas de `.env` ou `.env.local` à la racine
- ❌ Variables Supabase non configurées pour l'app principale
- ✅ `.env.local` existe dans `new_andoh-dohgad/` mais incomplet

### 5. **INCOHÉRENCE AVEC LA DOCUMENTATION**
- `CLAUDE.md` décrit une structure avec `/src/` à la racine
- La réalité montre que le code est éparpillé dans 2 sous-dossiers

---

## ✅ CE QUI EXISTE ET FONCTIONNE

### Backend (new_andoh-dohgad/)
- ✅ Configuration Supabase complète
- ✅ Migrations SQL pour 13 tables
- ✅ Row Level Security (RLS) configuré
- ✅ Types TypeScript générés
- ✅ Intégrations paiement (Stripe, Orange Money, MTN)
- ✅ Système d'authentification avec rôles (admin, client, etc.)
- ✅ Contextes React (AuthContext)
- ✅ Composants admin (Dashboard, CreateUser, ImageUpload)
- ✅ Edge Functions Supabase

### Frontend (webandoh/)
- ✅ React 19 + TypeScript + Vite
- ✅ 14 pages avec routing React Router v7
- ✅ Animations GSAP + ScrollTrigger
- ✅ Internationalisation i18next (FR/EN/ES)
- ✅ shadcn/ui components
- ✅ Formulaires avec react-hook-form + Zod
- ✅ Intégration EmailJS
- ✅ Tailwind CSS configuré

---

## 🎯 SOLUTION RECOMMANDÉE

### Option 1: ARCHITECTURE MONOREPO (RECOMMANDÉ)

**Objectif**: Fusionner backend et frontend dans une structure unifiée

```
/home/serge/Téléchargements/dohgahnew/
│
├── src/                          ← CRÉER
│   ├── components/               (fusionner webandoh + new_andoh-dohgad)
│   │   ├── public/               Composants site public (webandoh)
│   │   ├── admin/                Composants admin (new_andoh-dohgad)
│   │   ├── layout/               Layouts partagés
│   │   └── ui/                   shadcn/ui
│   │
│   ├── pages/                    
│   │   ├── public/               Pages publiques (webandoh)
│   │   └── admin/                Pages admin (new_andoh-dohgad)
│   │
│   ├── lib/                      
│   │   ├── supabase/             Client + types
│   │   ├── stripe/               Config Stripe
│   │   ├── mobile-money/         Orange + MTN
│   │   ├── i18n.ts               Traductions
│   │   └── utils.ts              Utilitaires
│   │
│   ├── contexts/                 
│   │   └── AuthContext.tsx       Authentification
│   │
│   ├── data/                     Données statiques (webandoh)
│   ├── sections/                 Sections pages (webandoh)
│   ├── hooks/                    Custom hooks
│   ├── types/                    Types TypeScript
│   │
│   ├── App.tsx                   Routes complètes (public + admin)
│   └── main.tsx                  Point d'entrée unique
│
├── public/                       Ressources statiques
├── supabase/                     Migrations + seed
├── .env.local                    ← CRÉER avec toutes les clés
├── package.json                  Dépendances complètes
├── vite.config.ts                Config unifiée
└── CLAUDE.md                     Documentation à jour
```

**Avantages**:
- ✅ Structure unique et cohérente
- ✅ Partage de code entre public et admin
- ✅ Un seul build, un seul déploiement
- ✅ Configuration centralisée

**Étapes de migration**:
1. Créer `/src/` à la racine
2. Copier le contenu de `/webandoh/` dans `/src/`
3. Intégrer les composants admin de `/new_andoh-dohgad/src/` dans `/src/components/admin/`
4. Créer `/src/lib/supabase/` avec la config backend
5. Fusionner les routes dans un seul `App.tsx`
6. Créer `.env.local` avec toutes les variables
7. Installer les dépendances (`npm install`)
8. Supprimer `/webandoh/` et `/new_andoh-dohgad/`
9. Mettre à jour `CLAUDE.md`


**Objectif**: Séparer frontend et backend en packages indépendants

```
/home/serge/Téléchargements/dohgahnew/
│
├── packages/
│   ├── frontend/                 Site public (webandoh)
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── admin/                    Dashboard admin (new_andoh-dohgad)
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── shared/                   Code partagé
│       ├── lib/supabase/
│       ├── lib/stripe/
│       └── types/
│
├── supabase/                     Backend unique
├── package.json                  Workspace root
└── .env.local                    Variables globales
```

**Inconvénients**:
- ❌ Configuration complexe (monorepo avec npm workspaces ou pnpm)
- ❌ Déploiements multiples
- ❌ Plus difficile à maintenir

---

## 🚀 PLAN D'ACTION RECOMMANDÉ

### Phase 1: Restauration immédiate (30 min)

1. **Restaurer la structure src/**
   ```bash
   # Créer le dossier src
   mkdir -p src
   
   # Copier tout le contenu de webandoh vers src
   cp -r webandoh/* src/
   
   # Vérifier la structure
   ls -la src/
   ```

2. **Créer le fichier .env.local**
   ```bash
   cp new_andoh-dohgad/.env.local .env.local
   ```

3. **Installer les dépendances**
   ```bash
   npm install
   ```

4. **Tester le démarrage**
   ```bash
   npm run dev
   ```

**Résultat attendu**: Site public fonctionnel sur http://localhost:3000

---

### Phase 2: Intégration backend (2h)

1. **Copier la configuration Supabase**
   ```bash
   mkdir -p src/lib/supabase
   cp new_andoh-dohgad/src/lib/supabase/* src/lib/supabase/
   
   mkdir -p src/lib/stripe
   cp new_andoh-dohgad/src/lib/stripe/* src/lib/stripe/
   
   mkdir -p src/lib/mobile-money
   cp new_andoh-dohgad/src/lib/mobile-money/* src/lib/mobile-money/
   ```

2. **Copier les composants admin**
   ```bash
   cp -r new_andoh-dohgad/src/components/auth src/components/
   cp -r new_andoh-dohgad/src/components/admin src/components/
   ```

3. **Copier les contextes**
   ```bash
   cp -r new_andoh-dohgad/src/contexts src/
   ```

4. **Copier les pages admin**
   ```bash
   cp -r new_andoh-dohgad/src/pages/admin src/pages/
   ```

5. **Intégrer les routes admin dans App.tsx**
   - Ajouter les routes protégées pour `/admin`, `/dashboard`, etc.
   - Utiliser `ProtectedRoute` pour sécuriser les routes admin

6. **Copier les migrations Supabase**
   ```bash
   cp -r new_andoh-dohgad/supabase .
   ```

---

### Phase 3: Configuration et tests (1h)

1. **Compléter le .env.local**
   - Récupérer les clés Supabase réelles
   - Configurer Stripe (test mode)
   - Ajouter les clés EmailJS

2. **Configurer Supabase**
   - Exécuter les migrations dans l'ordre
   - Créer le compte admin initial
   - Tester l'authentification

3. **Tester les fonctionnalités**
   - ✅ Pages publiques
   - ✅ Formulaires (contact, rendez-vous)
   - ✅ Login admin
   - ✅ Dashboard admin
   - ✅ CRUD services/blog

---

### Phase 4: Nettoyage (30 min)

1. **Supprimer les doublons**
   ```bash
   rm -rf webandoh/
   rm -rf new_andoh-dohgad/
   ```

2. **Mettre à jour CLAUDE.md**
   - Documenter la nouvelle structure
   - Mettre à jour les chemins

3. **Commit final**
   ```bash
   git add .
   git commit -m "Restructuration complète: fusion backend + frontend"
   ```

---

## 📋 CHECKLIST DE VALIDATION

- [ ] `npm install` réussit sans erreurs
- [ ] `npm run dev` démarre le serveur sur port 3000
- [ ] Pages publiques accessibles et fonctionnelles
- [ ] Formulaires de contact/rendez-vous fonctionnent
- [ ] Changement de langue (FR/EN/ES) fonctionne
- [ ] `/login` affiche le formulaire d'authentification
- [ ] Login admin réussit et redirige vers `/admin/dashboard`
- [ ] Dashboard admin affiche les statistiques
- [ ] CRUD services fonctionnel
- [ ] CRUD blog fonctionnel
- [ ] Upload d'images fonctionne
- [ ] Build production (`npm run build`) réussit

---

## 🔧 COMMANDES UTILES

```bash
# Vérifier l'état Git
git status

# Voir les fichiers supprimés
git ls-files --deleted

# Restaurer tous les fichiers supprimés
git restore src/

# Voir la structure du projet
tree -L 3 -I 'node_modules|.git'

# Vérifier les dépendances manquantes
npm list --depth=0

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Tester la build
npm run build
npm run preview
```

---

## 📞 PROCHAINES ÉTAPES

1. **Exécuter Phase 1** pour restaurer le fonctionnement de base
2. **Choisir Option 1 (Monorepo)** pour l'architecture finale
3. **Exécuter Phases 2-4** pour l'intégration complète
4. **Configurer Supabase** avec les vraies clés API
5. **Déployer sur Vercel** une fois tout fonctionnel

---

**Créé par**: Claude Code  
**Version**: 1.0  
**Dernière mise à jour**: 14 juillet 2026
