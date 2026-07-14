# 🔑 RÉCUPÉRER LA VRAIE CLÉ API SUPABASE

## 📍 Votre projet existe !

URL du projet : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo

Le problème est que `.env.local` contient "PLACEHOLDER" au lieu de la vraie clé.

## ✅ ÉTAPES POUR RÉCUPÉRER LA CLÉ (2 minutes)

### Étape 1 : Ouvrir la page API

1. Cliquer sur ce lien : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/settings/api

   OU

2. Dans le dashboard Supabase :
   - Cliquer sur l'icône **⚙️ Settings** (en bas à gauche)
   - Cliquer sur **API**

### Étape 2 : Copier la clé "anon public"

Sur la page, vous verrez :

```
┌─────────────────────────────────────────────────────────┐
│ Project API keys                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ anon public                                             │
│ This key is safe to use in a browser if you have       │
│ enabled Row Level Security for your tables.             │
│                                                         │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz... │
│ [📋 Copy]                                               │
│                                                         │
│ service_role secret                                     │
│ This key has the ability to bypass Row Level Security. │
│ Never share it publicly.                                │
│                                                         │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz... │
│ [📋 Copy]                                               │
└─────────────────────────────────────────────────────────┘
```

**⚠️ IMPORTANT : Copier UNIQUEMENT la clé "anon public" (la première)**

Cliquer sur le bouton **📋 Copy** à côté de "anon public"

### Étape 3 : Mettre à jour .env.local

Ouvrir le fichier : `/home/serge/Téléchargements/dohgahnew/webandoh/.env.local`

Trouver cette ligne :
```env
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzenN2YnpmdWZnbHZkY3NqenBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NTM2MDAsImV4cCI6MjA1MTMyOTYwMH0.PLACEHOLDER
```

Remplacer **UNIQUEMENT** ce qui vient après le `=` par la clé copiée :

```env
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzenN2YnpmdWZnbHZkY3NqenBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NTM2MDAsImV4cCI6MjA1MTMyOTYwMH0.[COLLER_ICI_LA_SIGNATURE_REELLE]
```

**Sauvegarder le fichier.**

### Étape 4 : Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C dans le terminal)

# Relancer
cd /home/serge/Téléchargements/dohgahnew/webandoh
npm run dev
```

### Étape 5 : Tester l'inscription

1. Ouvrir http://localhost:3000/inscription

2. Remplir le formulaire :
   - Prénom : Test
   - Nom : User
   - Email : test@example.com
   - Téléphone : +225 07 12 34 56 78
   - Mot de passe : test1234
   - Confirmer : test1234

3. Cliquer "S'inscrire"

4. ✅ **Si ça fonctionne** : Message "Inscription réussie" s'affiche

5. ❌ **Si erreur "Invalid API key"** : La clé n'a pas été copiée correctement

## 🧪 Vérifier que la clé est correcte

### Test 1 : Vérifier qu'il n'y a plus "PLACEHOLDER"

```bash
cat /home/serge/Téléchargements/dohgahnew/webandoh/.env.local | grep ANON_KEY
```

Devrait afficher une ligne SANS le mot "PLACEHOLDER"

### Test 2 : Tester la connexion dans la console navigateur

Ouvrir http://localhost:3000, puis F12 (console), taper :

```javascript
// Vérifier que la clé est chargée
console.log('Clé:', import.meta.env.VITE_SUPABASE_ANON_KEY);
// Ne doit PAS contenir "PLACEHOLDER"

// Tester la connexion Supabase
const { error } = await supabase.auth.getSession();
console.log('Erreur:', error);
// Devrait afficher : null
```

## 🎯 Résultat attendu

Après avoir mis la bonne clé :

✅ Plus d'erreur "Invalid API key"  
✅ L'inscription fonctionne  
✅ La connexion fonctionne  
✅ Les dashboards se chargent  

## 🔍 Vérifier les migrations

Si l'inscription fonctionne mais qu'il y a une erreur "table profiles does not exist" :

1. Aller sur https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/editor

2. Vérifier que la table "profiles" existe

3. Si elle n'existe pas, exécuter les migrations :
   - SQL Editor : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/sql/new
   - Copier le contenu de `/home/serge/Téléchargements/dohgahnew/supabase/migrations/20260706000001_create_profiles.sql`
   - Coller et exécuter (Run)
   - Répéter pour les 9 autres fichiers migrations

## ⚠️ IMPORTANT

**NE JAMAIS utiliser la clé "service_role" côté client !**

Utilisez UNIQUEMENT la clé "anon public" dans `.env.local`

---

**Lien direct vers la page API :**  
https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/settings/api
