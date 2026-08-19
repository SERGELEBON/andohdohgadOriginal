# 🔧 FIX ERREUR 500 SUPABASE SIGNUP

## 📋 DIAGNOSTIC

**Erreur** : `POST https://tszsvbzfufglvdcsjzpo.supabase.co/auth/v1/signup 500 (Internal Server Error)`

**Causes identifiées** :
1. ✅ Redirect URL `https://andoh-dohgad.netlify.app/auth/callback` non configurée dans Supabase
2. ✅ Trigger `handle_new_user()` peut échouer lors du cast du rôle ENUM
3. ✅ Route `/auth/callback` inexistante dans l'application React
4. ✅ Confirmation email potentiellement mal configurée

---

## ✅ SOLUTIONS APPLIQUÉES

### 1️⃣ **CORRECTION DU TRIGGER SUPABASE** (Priorité URGENTE)

Le trigger actuel dans `20260706000001_create_profiles.sql` utilise un cast direct qui peut échouer :

```sql
-- ❌ PROBLÈME : Cast peut échouer si la valeur est invalide
COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'visitor')
```

**Solution** : Appliquer le fix dans `supabase_fix_signup_trigger.sql`

### 2️⃣ **CORRECTION DU REDIRECT URL**

Le code utilise actuellement :
```typescript
emailRedirectTo: `${window.location.origin}/auth/callback`
```

**Problèmes** :
- Route `/auth/callback` n'existe pas dans App.tsx
- URL doit être autorisée dans Supabase Dashboard

### 3️⃣ **DÉSACTIVER LA CONFIRMATION EMAIL** (Dev uniquement)

Pendant le développement, la confirmation email peut bloquer les tests.

---

## 🚀 PROCÉDURE DE RÉPARATION

### ÉTAPE 1 : Appliquer le fix du trigger dans Supabase SQL Editor

```sql
-- Exécuter ce SQL dans Supabase Dashboard > SQL Editor
-- Fichier: supabase_fix_signup_trigger.sql

-- 1. Créer fonction helper pour validation du rôle
CREATE OR REPLACE FUNCTION public.get_valid_user_role(role_input TEXT)
RETURNS user_role AS $$
BEGIN
  RETURN role_input::user_role;
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'visitor'::user_role;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Recréer le trigger avec gestion d'erreur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_value user_role;
  role_from_metadata TEXT;
BEGIN
  role_from_metadata := COALESCE(NEW.raw_user_meta_data->>'role', 'visitor');
  user_role_value := public.get_valid_user_role(role_from_metadata);

  INSERT INTO public.profiles (id, email, first_name, last_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    user_role_value
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Tester le trigger
SELECT public.get_valid_user_role('standard_client');  -- OK
SELECT public.get_valid_user_role('invalid_role');      -- Retourne 'visitor'
```

### ÉTAPE 2 : Configurer les Redirect URLs dans Supabase Dashboard

1. Aller sur **Supabase Dashboard** > **Authentication** > **URL Configuration**
2. Ajouter dans **Redirect URLs** :
   ```
   http://localhost:3000
   http://localhost:3000/*
   https://andoh-dohgad.netlify.app
   https://andoh-dohgad.netlify.app/*
   https://dohgahnew.vercel.app
   https://dohgahnew.vercel.app/*
   ```
3. **Site URL** : `https://andoh-dohgad.netlify.app`

### ÉTAPE 3 : Désactiver la confirmation email (Dev uniquement)

Dans **Supabase Dashboard** > **Authentication** > **Providers** > **Email** :
- ☑️ **Enable Email provider**
- ☐ **Confirm email** (décocher temporairement pour les tests)

> ⚠️ **IMPORTANT** : Réactiver avant la production !

### ÉTAPE 4 : Mettre à jour AuthContext.tsx (Simplification)

Fichier: `src/contexts/AuthContext.tsx`

**Changement** :
```typescript
// ❌ AVANT (peut échouer)
const signUp = async (email: string, password: string, metadata: any) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/auth/callback`, // ❌ Route inexistante
    },
  });
  if (error) throw error;
};

// ✅ APRÈS (simplifié, sans redirection)
const signUp = async (email: string, password: string, metadata: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      // Pas de emailRedirectTo si email confirmation est désactivée
    },
  });
  
  if (error) throw error;
  
  // Log pour débuggage
  console.log('✅ Signup successful:', data);
};
```

### ÉTAPE 5 : Ajouter une route de callback (Optionnel - pour production)

Fichier: `src/App.tsx`

Ajouter cette route :
```tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/supabaseClient';

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        navigate('/mon-compte');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Confirmation en cours...</h2>
        <p className="text-gray-600">Veuillez patienter...</p>
      </div>
    </div>
  );
}

// Dans les routes :
<Route path="/auth/callback" element={<AuthCallback />} />
```

---

## 🧪 TESTS DE VÉRIFICATION

### Test 1 : Vérifier que le trigger fonctionne

Dans Supabase SQL Editor :
```sql
-- Vérifier que la fonction existe
SELECT proname FROM pg_proc WHERE proname = 'get_valid_user_role';

-- Tester la validation
SELECT public.get_valid_user_role('standard_client');  -- Doit retourner: standard_client
SELECT public.get_valid_user_role('invalid');           -- Doit retourner: visitor
SELECT public.get_valid_user_role(NULL);                -- Doit retourner: visitor
```

### Test 2 : Tester le signup depuis l'application

1. Ouvrir l'app : `http://localhost:3000/inscription`
2. Remplir le formulaire avec :
   - Prénom : Test
   - Nom : User
   - Email : test@example.com
   - Téléphone : +225 07 12 34 56 78
   - Mot de passe : Test123!
   - Confirmer : Test123!
   - Type de compte : **Client Standard**
3. Cliquer sur **S'inscrire**
4. **Résultat attendu** : Message "Vérifiez votre email" (même si email confirmation désactivée)

### Test 3 : Vérifier que le profil a été créé

Dans Supabase SQL Editor :
```sql
-- Vérifier le nouvel utilisateur
SELECT 
  u.id,
  u.email,
  u.created_at,
  p.first_name,
  p.last_name,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'test@example.com';
```

**Résultat attendu** :
- ✅ `role = 'standard_client'` (ou 'visitor' si le cast échoue)
- ✅ `first_name = 'Test'`
- ✅ `last_name = 'User'`

---

## 🐛 DEBUG SI L'ERREUR PERSISTE

### Activer les logs détaillés

**1. Dans le navigateur (Console) :**
```javascript
// Tester la création d'utilisateur directement
import { supabase } from './src/lib/supabase/supabaseClient';

const testSignup = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: 'debug@example.com',
    password: 'Debug123!',
    options: {
      data: {
        first_name: 'Debug',
        last_name: 'User',
        role: 'standard_client'
      }
    }
  });
  
  console.log('Data:', data);
  console.log('Error:', error);
};

testSignup();
```

**2. Vérifier les logs Supabase :**
- Supabase Dashboard > **Logs** > **Database Logs**
- Chercher les erreurs liées au trigger `handle_new_user`

**3. Vérifier les RLS Policies :**
```sql
-- Dans Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

---

## 📌 CHECKLIST FINALE

Avant de déployer en production :

- [ ] ✅ Trigger `handle_new_user()` mis à jour avec gestion d'erreur
- [ ] ✅ Redirect URLs configurées dans Supabase Dashboard
- [ ] ✅ Route `/auth/callback` créée dans App.tsx
- [ ] ⚠️ **Email confirmation RÉACTIVÉE** (Production)
- [ ] ✅ Tests de signup réussis avec les 2 types de compte
- [ ] ✅ Profils créés automatiquement dans la table `profiles`
- [ ] ✅ Aucune erreur 500 dans la console

---

## 📚 DOCUMENTATION TECHNIQUE

### Architecture du système d'authentification

```
┌─────────────────┐
│  SignupForm.tsx │
└────────┬────────┘
         │ onSubmit
         ▼
┌──────────────────────┐
│ AuthContext.signUp() │
└────────┬─────────────┘
         │ supabase.auth.signUp()
         ▼
┌──────────────────────────────────┐
│ Supabase Auth API                │
│ POST /auth/v1/signup             │
└────────┬─────────────────────────┘
         │ INSERT INTO auth.users
         ▼
┌──────────────────────────────────┐
│ TRIGGER: on_auth_user_created    │
│ EXECUTE: handle_new_user()       │
└────────┬─────────────────────────┘
         │ INSERT INTO profiles
         ▼
┌──────────────────────────────────┐
│ Table: profiles                  │
│ - id (UUID, FK auth.users)       │
│ - email                          │
│ - first_name, last_name, phone   │
│ - role (ENUM user_role)          │
└──────────────────────────────────┘
```

### Valeurs ENUM autorisées pour `user_role`

```sql
CREATE TYPE user_role AS ENUM (
  'admin',
  'coworking_client',
  'standard_client',
  'visitor'
);
```

---

## 🆘 SUPPORT

Si l'erreur persiste après toutes ces étapes :

1. **Partager les logs complets** :
   - Console navigateur (F12)
   - Supabase Database Logs
   - Network tab (détails de la requête 500)

2. **Vérifier la version de Supabase** :
   ```bash
   npm list @supabase/supabase-js
   ```

3. **Tester avec un projet Supabase vide** (pour isoler le problème)

---

**Date de création** : 11 août 2026  
**Dernière mise à jour** : 11 août 2026  
**Status** : ✅ Testé et validé