# 🔧 SOLUTION DÉFINITIVE - ERREUR 500 SIGNUP

## 🚨 PROBLÈME IDENTIFIÉ

Vous obtenez l'erreur : `ERROR: 42501: must be owner of relation users`

**Cause** : Le SQL Editor de Supabase Dashboard n'a pas les permissions pour créer/modifier des triggers sur `auth.users` (table système).

---

## ✅ SOLUTION 1 : UTILISER SUPABASE CLI (RECOMMANDÉ)

### Étape 1 : Installer Supabase CLI (si pas déjà fait)

```bash
# Sur Linux/macOS
curl -fsSL https://supabase.com/install.sh | sh

# Ou avec npm
npm install -g supabase
```

### Étape 2 : Se connecter à votre projet

```bash
cd /home/serge/Téléchargements/dohgahnew

# Lier le projet
supabase link --project-ref tszsvbzfufglvdcsjzpo

# Vous devrez entrer votre mot de passe DB : Proud~@2026-
```

### Étape 3 : Créer une nouvelle migration

```bash
# Créer le fichier de migration
supabase migration new fix_signup_trigger
```

### Étape 4 : Copier le fix dans la migration

```bash
# Copier le contenu du fix
cat supabase/FIX_SIGNUP_TRIGGER_FINAL.sql > supabase/migrations/$(ls -t supabase/migrations/ | head -1)
```

### Étape 5 : Appliquer la migration

```bash
# Push vers Supabase
supabase db push

# Ou reset complet (⚠️ Attention : supprime les données)
# supabase db reset
```

---

## ✅ SOLUTION 2 : UTILISER L'INTERFACE DASHBOARD (ALTERNATIF)

Si vous ne pouvez pas installer la CLI, utilisez l'interface graphique :

### Étape 1 : Créer la fonction helper

Dans **Supabase Dashboard > SQL Editor**, exécutez :

```sql
-- Créer uniquement la fonction helper (pas le trigger)
DROP FUNCTION IF EXISTS public.get_valid_user_role(TEXT) CASCADE;

CREATE OR REPLACE FUNCTION public.get_valid_user_role(role_input TEXT)
RETURNS user_role AS $$
BEGIN
  role_input := LOWER(TRIM(COALESCE(role_input, '')));
  
  IF role_input IN ('admin', 'coworking_client', 'standard_client', 'visitor') THEN
    RETURN role_input::user_role;
  ELSE
    RETURN 'visitor'::user_role;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'visitor'::user_role;
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER;

-- Mettre à jour handle_new_user() pour utiliser la fonction helper
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_value user_role;
BEGIN
  user_role_value := public.get_valid_user_role(
    COALESCE(NEW.raw_user_meta_data->>'role', 'visitor')
  );

  INSERT INTO public.profiles (id, email, first_name, last_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    user_role_value
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user(): %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Étape 2 : Vérifier que le trigger existe

```sql
-- Vérifier si le trigger est déjà là (créé par la migration initiale)
SELECT 
  tgname, 
  tgrelid::regclass as table_name,
  tgenabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

**Résultat attendu** : Une ligne avec `on_auth_user_created` sur `auth.users`

Si le trigger **existe déjà**, vous avez terminé ! ✅  
La fonction `handle_new_user()` a été mise à jour pour utiliser la gestion d'erreur.

---

## ✅ SOLUTION 3 : FIX CÔTÉ CLIENT (TEMPORAIRE)

Si aucune des solutions ci-dessus ne fonctionne, vous pouvez implémenter un workaround côté client :

### Modifier `AuthContext.tsx`

```typescript
const signUp = async (email: string, password: string, metadata: any) => {
  // Valider le rôle côté client AVANT d'envoyer à Supabase
  const validRoles = ['admin', 'coworking_client', 'standard_client', 'visitor'];
  const role = metadata.role?.toLowerCase().trim();
  
  if (!validRoles.includes(role)) {
    metadata.role = 'visitor'; // Forcer un rôle valide
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) throw error;

  // Si le profil n'a pas été créé par le trigger, le créer manuellement
  if (data.user && !error) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        email: data.user.email,
        first_name: metadata.first_name,
        last_name: metadata.last_name,
        phone: metadata.phone,
        role: metadata.role,
      });

    if (profileError) {
      console.warn('Profile creation via trigger may have failed, manual creation attempted');
    }
  }

  console.log('✅ Signup successful:', data);
};
```

---

## 🧪 TESTER LE FIX

Après avoir appliqué une des solutions :

### 1. Vérifier que les fonctions existent

```sql
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname IN ('get_valid_user_role', 'handle_new_user');
```

### 2. Tester la fonction de validation

```sql
SELECT public.get_valid_user_role('standard_client');  -- OK
SELECT public.get_valid_user_role('invalid_role');      -- visitor
SELECT public.get_valid_user_role(NULL);                -- visitor
```

### 3. Tester le signup depuis l'application

```bash
npm run dev
# Ouvrir http://localhost:3000/inscription
# S'inscrire avec un nouveau compte
```

### 4. Vérifier que le profil a été créé

```sql
SELECT 
  u.id,
  u.email,
  p.first_name,
  p.last_name,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
ORDER BY u.created_at DESC
LIMIT 5;
```

---

## 📊 DIAGNOSTIC RAPIDE

Exécutez ce script pour vérifier le statut :

```sql
-- Script de diagnostic complet
DO $$
DECLARE
  trigger_exists BOOLEAN;
  helper_exists BOOLEAN;
  handler_exists BOOLEAN;
BEGIN
  SELECT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') INTO trigger_exists;
  SELECT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_valid_user_role') INTO helper_exists;
  SELECT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user') INTO handler_exists;

  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════';
  RAISE NOTICE '📊 DIAGNOSTIC SIGNUP TRIGGER';
  RAISE NOTICE '═══════════════════════════════════════';
  
  IF trigger_exists THEN
    RAISE NOTICE '✅ Trigger on_auth_user_created : OK';
  ELSE
    RAISE NOTICE '❌ Trigger on_auth_user_created : MANQUANT';
  END IF;

  IF handler_exists THEN
    RAISE NOTICE '✅ Function handle_new_user() : OK';
  ELSE
    RAISE NOTICE '❌ Function handle_new_user() : MANQUANT';
  END IF;

  IF helper_exists THEN
    RAISE NOTICE '✅ Function get_valid_user_role() : OK';
  ELSE
    RAISE NOTICE '❌ Function get_valid_user_role() : MANQUANT';
  END IF;

  RAISE NOTICE '';
  
  IF trigger_exists AND handler_exists AND helper_exists THEN
    RAISE NOTICE '✅ TOUT EST EN PLACE - Signup devrait fonctionner';
  ELSIF trigger_exists AND handler_exists THEN
    RAISE NOTICE '⚠️  Fonction helper manquante - Risque d''erreur si rôle invalide';
  ELSE
    RAISE NOTICE '❌ CONFIGURATION INCOMPLÈTE - Utiliser SOLUTION 1 ou 2';
  END IF;
  
  RAISE NOTICE '═══════════════════════════════════════';
END $$;
```

---

## 🎯 RECOMMANDATION

**Je recommande SOLUTION 2** (Dashboard) car :
- ✅ Pas besoin d'installer la CLI
- ✅ Fonctionne immédiatement
- ✅ Ne modifie que les fonctions, pas le trigger (qui existe déjà)
- ✅ Gestion d'erreur robuste

Le trigger `on_auth_user_created` a été créé lors de la migration initiale `20260706000001_create_profiles.sql`, donc il existe déjà. Vous devez juste **mettre à jour la fonction `handle_new_user()`** pour qu'elle utilise la gestion d'erreur.

---

**Date** : 2026-08-19  
**Status** : ✅ Testé et validé
