# 🛠️ COMMANDES ESSENTIELLES - ANDOH & DOHGAD

## 🚀 RÉPARATION (À FAIRE EN PREMIER)

### Option 1: Script automatique (RECOMMANDÉ)
```bash
# Rendre le script exécutable (une seule fois)
chmod +x REPARER_PROJET.sh

# Lancer la réparation automatique
./REPARER_PROJET.sh
```

### Option 2: Réparation manuelle rapide
```bash
# Créer src/ et copier le frontend
mkdir -p src && cp -r webandoh/* src/

# Copier les configs backend
mkdir -p src/lib/supabase && cp -r new_andoh-dohgad/src/lib/supabase/* src/lib/supabase/
mkdir -p src/lib/stripe && cp -r new_andoh-dohgad/src/lib/stripe/* src/lib/stripe/
mkdir -p src/components/admin && cp -r new_andoh-dohgad/src/components/admin/* src/components/admin/
mkdir -p src/components/auth && cp -r new_andoh-dohgad/src/components/auth/* src/components/auth/
cp -r new_andoh-dohgad/src/contexts/* src/contexts/
cp -r new_andoh-dohgad/supabase .

# Créer .env.local et installer
cp new_andoh-dohgad/.env.local .env.local
npm install
```

---

## 📦 GESTION DES DÉPENDANCES

### Installation
```bash
# Installation normale
npm install

# Installation propre (si problèmes)
rm -rf node_modules package-lock.json
npm install

# Installer une dépendance spécifique
npm install @supabase/supabase-js
```

### Vérification
```bash
# Lister les dépendances installées
npm list --depth=0

# Vérifier les dépendances manquantes
npm list --depth=0 | grep UNMET

# Vérifier les vulnérabilités
npm audit

# Corriger les vulnérabilités
npm audit fix
```

---

## 🖥️ DÉVELOPPEMENT

### Démarrer le serveur
```bash
# Mode développement (port 3000)
npm run dev

# Accéder au site
# http://localhost:3000
```

### Build et preview
```bash
# Build de production
npm run build

# Preview du build
npm run preview

# Build + preview
npm run build && npm run preview
```

### Linting
```bash
# Vérifier le code
npm run lint

# Fixer automatiquement
npm run lint -- --fix
```

---

## 🔍 DIAGNOSTIC

### Vérifier la structure
```bash
# Vérifier que src/ existe
ls -la src/

# Voir l'arborescence complète (si tree installé)
tree -L 3 -I 'node_modules|.git'

# Alternative sans tree
find . -maxdepth 3 -type d -not -path '*/node_modules/*' -not -path '*/.git/*' | sort

# Vérifier les fichiers critiques
test -f src/App.tsx && echo "✅ App.tsx" || echo "❌ App.tsx MANQUANT"
test -f src/main.tsx && echo "✅ main.tsx" || echo "❌ main.tsx MANQUANT"
test -f src/lib/supabase/client.ts && echo "✅ Supabase client" || echo "❌ Supabase MANQUANT"
```

### Vérifier la configuration
```bash
# Vérifier .env.local
test -f .env.local && echo "✅ .env.local existe" || echo "❌ .env.local MANQUANT"

# Voir le contenu (sans les secrets)
cat .env.local | grep -E "^VITE_|^#"

# Vérifier vite.config.ts
cat vite.config.ts

# Vérifier package.json
cat package.json | grep "name\|version\|scripts"
```

---

## 🔄 GIT

### Vérifier l'état
```bash
# Statut Git
git status

# Voir les fichiers supprimés
git status --short | grep "^ D"

# Voir les modifications
git diff

# Voir l'historique
git log --oneline -10
```

### Restaurer des fichiers
```bash
# Restaurer un fichier supprimé
git restore src/App.tsx

# Restaurer tous les fichiers supprimés dans src/
git restore src/

# Annuler toutes les modifications
git reset --hard HEAD

# Voir ce qui a été supprimé
git log --diff-filter=D --summary
```

### Commits
```bash
# Ajouter tous les fichiers
git add .

# Commit
git commit -m "Restructuration: fusion backend + frontend"

# Push
git push origin main
```

---

## 🗄️ SUPABASE

### Configuration locale
```bash
# Voir la structure des migrations
ls -la supabase/migrations/

# Compter les migrations
ls supabase/migrations/*.sql | wc -l

# Voir le contenu d'une migration
cat supabase/migrations/001_create_profiles.sql
```

### Supabase CLI (si installé)
```bash
# Login
supabase login

# Lier le projet
supabase link --project-ref tszsvbzfufglvdcsjzpo

# Appliquer les migrations
supabase db push

# Générer les types TypeScript
supabase gen types typescript --local > src/lib/supabase/database.types.ts
```

---

## 🧹 NETTOYAGE

### Nettoyer le projet
```bash
# Supprimer node_modules
rm -rf node_modules

# Supprimer le cache Vite
rm -rf .vite

# Supprimer le build
rm -rf dist

# Nettoyage complet
rm -rf node_modules .vite dist package-lock.json
```

### Supprimer les doublons (après réparation)
```bash
# Vérifier que src/ contient tout
ls -la src/components/admin    # Doit exister
ls -la src/lib/supabase        # Doit exister

# Supprimer les doublons
rm -rf webandoh/
rm -rf new_andoh-dohgad/

# Vérification
ls -la | grep -E "webandoh|new_andoh"   # Ne doit rien afficher
```

---

## 🐛 DEBUGGING

### Logs et erreurs
```bash
# Voir les logs npm détaillés
npm run dev --verbose

# Voir les processus sur port 3000
lsof -i :3000

# Tuer le processus sur port 3000
lsof -ti:3000 | xargs kill -9

# Voir les erreurs TypeScript
npx tsc --noEmit

# Voir les erreurs ESLint
npm run lint
```

### Vérifier les imports
```bash
# Chercher les imports cassés
grep -r "from '@/" src/ | grep -v node_modules

# Vérifier les imports Supabase
grep -r "@supabase/supabase-js" src/

# Vérifier les imports Stripe
grep -r "@stripe/stripe-js" src/
```

### Tests de connectivité
```bash
# Tester la connexion à Supabase (si curl installé)
curl https://tszsvbzfufglvdcsjzpo.supabase.co

# Vérifier les variables d'environnement
env | grep VITE_
```

---

## 📊 INFORMATIONS SYSTÈME

### Versions
```bash
# Version Node.js
node --version

# Version npm
npm --version

# Version Git
git --version

# Informations système
uname -a
```

### Espace disque
```bash
# Taille du projet
du -sh .

# Taille de node_modules
du -sh node_modules

# Taille de chaque dossier
du -sh */ | sort -h

# Espace disque disponible
df -h .
```

---

## 🔐 SÉCURITÉ

### Variables d'environnement
```bash
# Vérifier que .env.local n'est pas committé
git ls-files | grep .env.local   # Ne doit rien retourner

# Vérifier le .gitignore
cat .gitignore | grep -E "\.env"

# Chercher les secrets hardcodés (dangereux)
grep -r "supabase.co" src/ --exclude-dir=node_modules
grep -r "pk_live\|sk_live" src/ --exclude-dir=node_modules
```

### Permissions
```bash
# Vérifier les permissions .env.local
ls -la .env.local

# Restreindre les permissions (recommandé)
chmod 600 .env.local

# Vérifier les scripts exécutables
ls -la *.sh
```

---

## 📝 DOCUMENTATION

### Lire la documentation
```bash
# Diagnostic complet
cat DIAGNOSTIC_COMPLET.md

# Solution rapide
cat SOLUTION_RAPIDE.md

# Comparatif avant/après
cat COMPARATIF_AVANT_APRES.md

# Documentation projet
cat CLAUDE.md

# Backend README
cat new_andoh-dohgad/BACKEND_README.md 2>/dev/null || echo "Fichier non trouvé (normal après réparation)"
```

### Chercher dans la documentation
```bash
# Chercher un terme spécifique
grep -i "supabase" *.md

# Chercher dans tous les fichiers Markdown
grep -r "authentication" *.md

# Liste tous les fichiers .md
ls -1 *.md
```

---

## 🚀 DÉPLOIEMENT

### Préparation
```bash
# Build de production
npm run build

# Vérifier le build
ls -lh dist/

# Tester le build localement
npm run preview
```

### Vercel (si configuré)
```bash
# Installer Vercel CLI
npm install -g vercel

# Login
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

---

## 📋 CHECKLIST QUOTIDIENNE

```bash
# 1. Mettre à jour les dépendances
git pull
npm install

# 2. Démarrer le serveur
npm run dev

# 3. Vérifier les erreurs
npm run lint

# 4. Tester les changements
npm run build

# 5. Commit si tout est OK
git add .
git commit -m "Description des changements"
git push
```

---

## 🆘 COMMANDES D'URGENCE

### Projet ne démarre pas
```bash
# Solution 1: Nettoyer et réinstaller
rm -rf node_modules package-lock.json .vite dist
npm install
npm run dev

# Solution 2: Vérifier la structure
test -d src && echo "OK" || (echo "ERREUR: src/ manquant" && ./REPARER_PROJET.sh)

# Solution 3: Reset Git complet (ATTENTION: perte des modifications)
git reset --hard HEAD
git clean -fd
npm install
```

### Port déjà utilisé
```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
lsof -ti:3000 | xargs kill -9

# Redémarrer
npm run dev
```

### Build échoue
```bash
# Vérifier les erreurs TypeScript
npx tsc --noEmit

# Build en mode verbose
npm run build -- --mode development

# Ignorer les erreurs TypeScript (temporaire)
SKIP_TYPE_CHECK=true npm run build
```

---

## 📞 SUPPORT

En cas de problème:

1. **Lire les fichiers de diagnostic**
   ```bash
   cat DIAGNOSTIC_COMPLET.md
   cat SOLUTION_RAPIDE.md
   ```

2. **Vérifier les logs**
   ```bash
   npm run dev 2>&1 | tee dev.log
   ```

3. **Relancer le script de réparation**
   ```bash
   ./REPARER_PROJET.sh
   ```

4. **Créer un rapport de bug**
   ```bash
   # Collecter les infos
   node --version > bug-report.txt
   npm --version >> bug-report.txt
   git status >> bug-report.txt
   npm list --depth=0 >> bug-report.txt
   ```

---

**Version**: 1.0  
**Dernière mise à jour**: 14 juillet 2026  
**Auteur**: Claude Code
