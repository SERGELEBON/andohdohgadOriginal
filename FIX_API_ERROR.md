# 🔧 FIX - Erreur "API Invalid"

## 🔍 PROBLÈME IDENTIFIÉ

L'erreur "API invalid" lors de l'inscription vient de cette ligne dans `.env.local` :

```env
VITE_SUPABASE_ANON_KEY=eyJ...PLACEHOLDER
```

La clé contient `PLACEHOLDER` au lieu d'une vraie signature JWT valide.

## ✅ SOLUTION

### Étape 1 : Récupérer la vraie clé Supabase

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet `tszsvbzfufglvdcsjzpo`
3. Menu **Settings** (⚙️) > **API**
4. Section **Project API keys**
5. Copiez la clé **anon public** (commence par `eyJhbG...`)

### Étape 2 : Mettre à jour .env.local

Ouvrez `/home/serge/Téléchargements/dohgahnew/webandoh/.env.local` et remplacez :

```env
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzenN2YnpmdWZnbHZkY3NqenBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NTM2MDAsImV4cCI6MjA1MTMyOTYwMH0.PLACEHOLDER
```

Par :

```env
VITE_SUPABASE_ANON_KEY=[COLLER_LA_VRAIE_CLÉ_ICI]
```

### Étape 3 : Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Relancer
npm run dev
```

### Étape 4 : Tester à nouveau

1. Ouvrir http://localhost:3000/inscription
2. Remplir le formulaire
3. Cliquer "S'inscrire"
4. ✅ Devrait fonctionner maintenant !

## 🔍 Comment vérifier la clé

La clé JWT valide ressemble à ça :

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzenN2YnpmdWZnbHZkY3NqenBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NTM2MDAsImV4cCI6MjA1MTMyOTYwMH0.ReVLOTRgWvXYqKZ9sYmX_VOTRE_SIGNATURE_ICI
```

**Structure JWT :**
- Partie 1 : `eyJhbGc...` (header)
- Partie 2 : `.eyJpc3M...` (payload)
- Partie 3 : `.ReVLOTR...` (signature) ← Cette partie ne doit PAS être "PLACEHOLDER"

## 🧪 Tester la connexion

Après avoir mis à jour la clé, testez dans la console navigateur (F12) :

```javascript
// Importer Supabase
import { supabase } from './src/lib/supabase/client';

// Tester la connexion
const { data, error } = await supabase.auth.getSession();
console.log('Error:', error);
console.log('Data:', data);

// Si error = null et data existe → ✅ Connexion OK
// Si error = "Invalid API key" → ❌ Clé encore incorrecte
```

## 📋 Checklist

- [ ] Aller sur Supabase Dashboard
- [ ] Copier la clé **anon public**
- [ ] Remplacer dans `.env.local`
- [ ] Vérifier qu'il n'y a pas "PLACEHOLDER"
- [ ] Redémarrer `npm run dev`
- [ ] Tester inscription
- [ ] ✅ Devrait fonctionner !

## ⚠️ Note importante

**Ne commitez JAMAIS le fichier `.env.local` dans Git !**

Le `.gitignore` devrait déjà le bloquer, mais vérifiez :

```bash
cat .gitignore | grep ".env.local"
# Devrait afficher : .env.local
```

Si ce n'est pas le cas, ajoutez-le :

```bash
echo ".env.local" >> .gitignore
```

## 🔐 Sécurité

La clé `anon public` est sûre à utiliser côté client car :
- Elle est limitée par Row Level Security (RLS)
- Les users ne peuvent accéder qu'à leurs propres données
- Les admins ont des permissions supplémentaires définies par RLS

**Ne partagez JAMAIS la clé `service_role` publiquement !**
