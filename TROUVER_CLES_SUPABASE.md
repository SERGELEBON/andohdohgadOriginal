# 🔑 TROUVER VOS CLÉS SUPABASE - GUIDE PRÉCIS

**Votre projet** : `tszsvbzfufglvdcsjzpo`  
**URL** : https://tszsvbzfufglvdcsjzpo.supabase.co

---

## ⚠️ CE QUE VOUS AVEZ TROUVÉ

Vous avez trouvé : `sb_publishable_8JE4raZ0xYRgi4knQnFnbQ_YAbY9NEU`

**Ce n'est PAS la bonne clé** ❌

Cette clé `sb_publishable_...` est une ancienne clé ou une clé pour un autre usage.

---

## ✅ LES VRAIES CLÉS QUE VOUS CHERCHEZ

Les clés Supabase sont des **JWT (JSON Web Tokens)** qui :

- ✅ Commencent par : `eyJhbGci...`
- ✅ Sont très longues : 200-400 caractères
- ✅ Contiennent 3 parties séparées par des points (`.`)
- ✅ Ressemblent à : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...`

---

## 📍 OÙ LES TROUVER - ÉTAPES EXACTES

### Étape 1 : Accéder à votre projet
```
URL directe : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/settings/api
```

### Étape 2 : Navigation dans le dashboard

Si le lien direct ne fonctionne pas :

```
1. Allez sur : https://supabase.com
2. Connectez-vous
3. Sélectionnez votre projet : tszsvbzfufglvdcsjzpo
4. Dans le menu de GAUCHE (sidebar), en BAS :
   Cliquez sur ⚙️ Settings
5. Dans le sous-menu qui s'ouvre, cliquez sur :
   📡 API
```

### Étape 3 : Sur la page API

Vous verrez **plusieurs sections** :

#### Section 1 : Project URL ✅ (déjà configuré)
```
https://tszsvbzfufglvdcsjzpo.supabase.co
```

#### Section 2 : Project API keys 🔑

Cherchez cette section exactement comme ceci :

```
┌──────────────────────────────────────────────────────┐
│  Project API keys                                    │
│                                                      │
│  These are your API keys for accessing the API.     │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ anon                                           │ │
│  │ public                                         │ │
│  │                                                │ │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M │ │ ← CLÉ 1
│  │ [👁 Show] [📋 Copy]                           │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ service_role                                   │ │
│  │ secret                                         │ │
│  │                                                │ │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M │ │ ← CLÉ 2
│  │ [👁 Show] [📋 Copy]                           │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Étape 4 : Copier les clés

#### CLÉ 1 : anon public (clé publique)

1. Cliquez sur **[👁 Show]** ou **[Reveal]**
2. La clé complète s'affichera
3. Cliquez sur **[📋 Copy]**
4. ✅ C'est votre `VITE_SUPABASE_ANON_KEY`

**Format attendu** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzenN2YnpmdWZnbHZkY3NqenBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NTM2MDAsImV4cCI6MjA1MTMyOTYwMH0.XXXXXXXXXXXX
```

#### CLÉ 2 : service_role (clé secrète)

1. Cliquez sur **[👁 Show]** ou **[Reveal]**
2. La clé complète s'affichera
3. Cliquez sur **[📋 Copy]**
4. ✅ C'est votre `SUPABASE_SERVICE_ROLE_KEY`

**Format attendu** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzenN2YnpmdWZnbHZkY3NqenBvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTc1MzYwMCwiZXhwIjoyMDUxMzI5NjAwfQ.XXXXXXXXXXXX
```

---

## 🔧 CONFIGURATION DANS .env.local

Une fois que vous avez copié les 2 clés :

### Option 1 : Éditeur de texte

```bash
nano /home/serge/Téléchargements/dohgahnew/.env.local
```

Remplacez ces lignes :

```env
# AVANT
VITE_SUPABASE_ANON_KEY=eyJ...PLACEHOLDER

# APRÈS (collez votre vraie clé)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
```

```env
# AVANT
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

# APRÈS (collez votre vraie clé)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
```

### Option 2 : Script automatique

Utilisez le script interactif :

```bash
./configurer-api.sh
```

Il vous demandera de coller les clés une par une.

---

## ✅ VÉRIFICATION

### 1. Vérifier que les clés sont bien configurées

```bash
cat .env.local | grep "VITE_SUPABASE_ANON_KEY"
```

**Résultat attendu** :
```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Si vous voyez `PLACEHOLDER` → Pas encore configuré ❌

### 2. Vérifier la longueur de la clé

Une vraie clé Supabase fait environ 200-400 caractères :

```bash
echo -n "$(grep VITE_SUPABASE_ANON_KEY .env.local | cut -d'=' -f2)" | wc -c
```

**Résultat attendu** : > 200

### 3. Redémarrer le serveur

```bash
# Arrêter
lsof -ti:3001 | xargs kill -9

# Démarrer
npm run dev
```

### 4. Tester la connexion dans le navigateur

1. Ouvrir : http://localhost:3001
2. Appuyer sur **F12** (DevTools)
3. Onglet **Console**
4. Taper :

```javascript
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
```

**Résultat attendu** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Si vous voyez `undefined` ou `PLACEHOLDER` → Pas configuré ❌

---

## 🆘 PROBLÈMES COURANTS

### "Je ne vois pas la section API Keys"

**Solution** :
1. Assurez-vous d'être dans **Settings → API** (pas Settings → General)
2. Rafraîchissez la page (F5)
3. Essayez le lien direct : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/settings/api

### "Je vois seulement 'sb_publishable_...'"

**Cause** : Vous êtes probablement dans une mauvaise section

**Solution** :
- Ne cherchez PAS dans "Project Settings"
- Allez dans **Settings → API** (dans le menu de gauche en bas)

### "Les clés sont trop courtes"

**Cause** : Vous n'avez copié qu'une partie de la clé

**Solution** :
1. Cliquez sur **[Show]** pour révéler la clé complète
2. Cliquez sur **[Copy]** pour copier automatiquement
3. Ne copiez PAS manuellement (risque de couper la clé)

### "Après configuration, l'app ne fonctionne toujours pas"

**Checklist** :
- [ ] Clé commence par `eyJhbGci` ✓
- [ ] Clé fait > 200 caractères ✓
- [ ] Pas d'espaces avant/après la clé ✓
- [ ] Serveur redémarré (`npm run dev`) ✓
- [ ] Cache navigateur vidé (Ctrl+Shift+R) ✓

---

## 📊 RÉCAPITULATIF DES INFORMATIONS

### ✅ Ce que vous avez déjà

```
✓ URL Supabase : https://tszsvbzfufglvdcsjzpo.supabase.co
✓ Projet ID : tszsvbzfufglvdcsjzpo
✓ Mot de passe DB : Proud~@2026-
```

### ❌ Ce qu'il manque

```
❌ VITE_SUPABASE_ANON_KEY (clé qui commence par eyJ...)
❌ SUPABASE_SERVICE_ROLE_KEY (clé qui commence par eyJ...)
```

### 📍 Où les trouver

```
URL directe : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/settings/api

Ou via navigation :
Supabase Dashboard → Votre projet → Settings (bas gauche) → API
```

---

## 🎯 PROCHAINE ÉTAPE

1. **Ouvrir le lien** : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/settings/api

2. **Copier les 2 clés** (anon + service_role)

3. **Lancer le script de configuration** :
   ```bash
   ./configurer-api.sh
   ```

4. **OU éditer manuellement** :
   ```bash
   nano .env.local
   ```

5. **Redémarrer le serveur** :
   ```bash
   npm run dev
   ```

6. **Tester** : http://localhost:3001/connexion

---

**Besoin d'aide ?** Partagez une capture d'écran de la page "Settings → API" si vous ne trouvez toujours pas les clés.