# 🚀 SOLUTION RAPIDE - RÉPARER LE PROJET EN 5 MINUTES

## 🔴 PROBLÈME ACTUEL

```
❌ Le projet NE FONCTIONNE PAS car:
   - Le dossier /src/ a été supprimé
   - Le code est éparpillé dans 2 dossiers différents
   - Les dépendances ne sont pas installées
```

## ✅ SOLUTION AUTOMATIQUE

### Option A: Script automatique (RECOMMANDÉ) ⚡

**1 seule commande à exécuter:**

```bash
./REPARER_PROJET.sh
```

Ce script va automatiquement:
- ✅ Créer le dossier `src/`
- ✅ Fusionner `webandoh/` et `new_andoh-dohgad/` dans `src/`
- ✅ Copier toutes les configurations (Supabase, Stripe, Mobile Money)
- ✅ Installer les dépendances npm
- ✅ Créer le fichier `.env.local`

**Durée**: ~2-3 minutes

---

### Option B: Réparation manuelle 🛠️

Si vous préférez contrôler chaque étape:

#### Étape 1: Restaurer src/ (1 min)
```bash
# Créer le dossier src
mkdir -p src

# Copier le frontend
cp -r webandoh/* src/

# Vérifier
ls -la src/
```

#### Étape 2: Intégrer le backend (2 min)
```bash
# Supabase
mkdir -p src/lib/supabase
cp -r new_andoh-dohgad/src/lib/supabase/* src/lib/supabase/

# Stripe
mkdir -p src/lib/stripe
cp -r new_andoh-dohgad/src/lib/stripe/* src/lib/stripe/

# Mobile Money
mkdir -p src/lib/mobile-money
cp -r new_andoh-dohgad/src/lib/mobile-money/* src/lib/mobile-money/

# Composants admin
mkdir -p src/components/admin
cp -r new_andoh-dohgad/src/components/admin/* src/components/admin/

# Auth
mkdir -p src/components/auth
cp -r new_andoh-dohgad/src/components/auth/* src/components/auth/

# Contextes
cp -r new_andoh-dohgad/src/contexts/* src/contexts/

# Migrations
cp -r new_andoh-dohgad/supabase .
```

#### Étape 3: Configuration (1 min)
```bash
# Créer .env.local
cp new_andoh-dohgad/.env.local .env.local

# Installer dépendances
npm install
```

#### Étape 4: Démarrer (30 sec)
```bash
npm run dev
```

**Résultat attendu**: Site accessible sur http://localhost:3000

---

## 🎯 APRÈS LA RÉPARATION

### 1. Configurer les clés API

Éditez `.env.local` et remplacez les valeurs:

```env
# Supabase (OBLIGATOIRE)
VITE_SUPABASE_URL=https://tszsvbzfufglvdcsjzpo.supabase.co
VITE_SUPABASE_ANON_KEY=votre_vraie_cle_ici

# Stripe (pour les paiements)
VITE_STRIPE_PUBLIC_KEY=pk_test_votre_cle

# EmailJS (pour les formulaires)
VITE_EMAILJS_SERVICE_ID=votre_service_id
VITE_EMAILJS_TEMPLATE_ID=votre_template_id
VITE_EMAILJS_PUBLIC_KEY=votre_public_key
```

### 2. Tester l'application

```bash
# Démarrer en dev
npm run dev

# Accéder à l'application
# http://localhost:3000
```

**Pages à tester:**
- ✅ Accueil: http://localhost:3000/
- ✅ Services: http://localhost:3000/services
- ✅ Contact: http://localhost:3000/contact
- ✅ Login admin: http://localhost:3000/login
- ✅ Dashboard: http://localhost:3000/admin/dashboard (après login)

### 3. Configurer Supabase (si pas encore fait)

```bash
# Aller dans le dossier supabase
cd supabase/migrations

# Les fichiers SQL sont déjà copiés
# Vous devez les exécuter dans votre projet Supabase
# (via le SQL Editor sur https://supabase.com)
```

**Ordre d'exécution des migrations:**
1. `001_create_profiles.sql` - Table des profils
2. `002_create_services.sql` - Table des services
3. `003_create_blog.sql` - Table blog
4. `004_create_documentation.sql` - Documentation
5. etc.

### 4. Créer un compte admin

Une fois les migrations exécutées, créez un admin:

```sql
-- Exécuter dans Supabase SQL Editor
-- Voir le fichier: supabase/SETUP_ADMIN.sql
```

---

## 📊 STRUCTURE FINALE

Après réparation, votre projet aura cette structure:

```
/home/serge/Téléchargements/dohgahnew/
│
├── src/                          ✅ RESTAURÉ
│   ├── App.tsx                   Routes complètes
│   ├── main.tsx                  Point d'entrée
│   │
│   ├── components/
│   │   ├── layout/               Header, Footer, Layout
│   │   ├── admin/                ✅ Dashboard, CreateUser, etc.
│   │   ├── auth/                 ✅ LoginForm, SignupForm
│   │   └── ui/                   shadcn/ui components
│   │
│   ├── pages/
│   │   ├── Home.tsx              Pages publiques
│   │   ├── Services.tsx
│   │   ├── Contact.tsx
│   │   └── admin/                ✅ Pages admin
│   │
│   ├── lib/
│   │   ├── supabase/             ✅ Client + types
│   │   ├── stripe/               ✅ Paiements
│   │   ├── mobile-money/         ✅ Orange + MTN
│   │   ├── i18n.ts               Traductions
│   │   └── utils.ts
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx       ✅ Authentification
│   │
│   ├── data/                     services, blog, etc.
│   ├── sections/                 Sections pages
│   ├── hooks/                    Custom hooks
│   └── types/                    Types TypeScript
│
├── supabase/                     ✅ Migrations SQL
│   ├── migrations/
│   └── seed/
│
├── public/                       Images, fonts
│
├── .env.local                    ✅ Variables d'environnement
├── package.json                  Dépendances
├── vite.config.ts                Configuration Vite
├── tsconfig.json                 Configuration TypeScript
└── CLAUDE.md                     Documentation

# Supprimés après réparation (doublons):
# ❌ webandoh/
# ❌ new_andoh-dohgad/
```

---

## ⚠️ PROBLÈMES COURANTS

### Erreur: "Cannot find module '@/...'"
```bash
# Solution: Vérifier que src/ existe
ls -la src/

# Si absent, relancer le script
./REPARER_PROJET.sh
```

### Erreur: "UNMET DEPENDENCY"
```bash
# Solution: Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur: "Port 3000 already in use"
```bash
# Solution: Tuer le processus sur port 3000
lsof -ti:3000 | xargs kill -9

# Ou changer le port dans vite.config.ts
# server: { port: 3001 }
```

### Page blanche après démarrage
```bash
# Solution: Vérifier les erreurs console
# Ouvrir DevTools (F12) et voir la console

# Vérifier que .env.local est bien configuré
cat .env.local
```

---

## 📞 AIDE SUPPLÉMENTAIRE

Si le script ne fonctionne pas:

1. **Lire le diagnostic complet**: `DIAGNOSTIC_COMPLET.md`
2. **Vérifier les logs**: Le script affiche des messages détaillés
3. **Vérifier la structure**: `tree -L 2 src/`
4. **Vérifier Git**: `git status`

---

## ✅ CHECKLIST DE VALIDATION

Après la réparation, vérifiez:

- [ ] `src/` existe et contient App.tsx, main.tsx
- [ ] `src/lib/supabase/` existe avec client.ts
- [ ] `.env.local` existe à la racine
- [ ] `npm install` réussit sans erreurs
- [ ] `npm run dev` démarre le serveur
- [ ] http://localhost:3000 affiche le site
- [ ] Les pages publiques sont accessibles
- [ ] Le changement de langue fonctionne (FR/EN/ES)
- [ ] `/login` affiche le formulaire

---

**Durée totale**: 5-10 minutes  
**Difficulté**: Facile (script automatique)  
**Support**: Voir DIAGNOSTIC_COMPLET.md pour plus de détails
