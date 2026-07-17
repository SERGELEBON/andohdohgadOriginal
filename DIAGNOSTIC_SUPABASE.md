# 🔍 Diagnostic Complet : Erreurs 500 Supabase + Processus de Création de Compte

## 🚨 Problème Principal : Erreurs 500 Supabase

### Tables en Erreur (toutes retournent 500)
```
❌ documentation_purchases
❌ coworking_subscriptions  
❌ appointments
❌ contact_messages
❌ profiles (parfois)
```

### 🎯 Cause Racine : TABLES NON CRÉÉES

**Les tables n'existent PAS dans la base de données Supabase !**

Quand Supabase essaie d'interroger une table inexistante :
```
GET /rest/v1/appointments → 500 Internal Server Error
```

Au lieu de :
```
GET /rest/v1/appointments → 200 OK (si table existe)
GET /rest/v1/appointments → 404 Not Found (si table vide)
```

---

## 📋 Processus de Création de Compte

### 🟢 Méthode 1 : Inscription Publique (/inscription)

```
┌─────────────────────────────────────────────────────────┐
│  ÉTAPE 1 : Utilisateur remplit le formulaire          │
├─────────────────────────────────────────────────────────┤
│  - Prénom + Nom                                         │
│  - Email                                                 │
│  - Téléphone                                             │
│  - Mot de passe (+ confirmation)                         │
│  - Type de compte: standard_client | coworking_client   │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  ÉTAPE 2 : SignupForm.tsx → AuthContext.signUp()      │
├─────────────────────────────────────────────────────────┤
│  supabase.auth.signUp({                                 │
│    email,                                                │
│    password,                                             │
│    options: {                                            │
│      data: { first_name, last_name, phone, role }       │
│    }                                                     │
│  })                                                      │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  ÉTAPE 3 : Supabase Auth crée l'utilisateur           │
├─────────────────────────────────────────────────────────┤
│  1. Créé dans auth.users ✅                            │
│  2. Email de confirmation envoyé 📧                     │
│  3. Metadata stockées (first_name, role, etc.)          │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  ÉTAPE 4 : TRIGGER DATABASE (si configuré)            │
├─────────────────────────────────────────────────────────┤
│  🚨 PROBLÈME : Le trigger n'existe probablement PAS !  │
│                                                          │
│  Devrait automatiquement créer un profil dans          │
│  la table "profiles" après création dans auth.users     │
│                                                          │
│  ❌ Sans trigger → Pas de profil créé                  │
│  ✅ Avec trigger → Profil créé automatiquement         │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  ÉTAPE 5 : Résultat                                    │
├─────────────────────────────────────────────────────────┤
│  auth.users : ✅ Utilisateur existe                    │
│  profiles   : ❌ Profil MANQUE                         │
│                                                          │
│  → L'utilisateur peut se connecter                      │
│  → Mais apparaît comme "Visiteur" (profil absent)      │
└─────────────────────────────────────────────────────────┘
```

### 🔵 Méthode 2 : Création par Admin (Dashboard Admin)

```
┌─────────────────────────────────────────────────────────┐
│  ÉTAPE 1 : Admin remplit CreateUserModal               │
├─────────────────────────────────────────────────────────┤
│  - Email                                                 │
│  - Mot de passe                                          │
│  - Prénom + Nom                                          │
│  - Téléphone (optionnel)                                 │
│  - Rôle: admin | coworking | standard | visitor        │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  ÉTAPE 2 : CreateUserModal.tsx                         │
├─────────────────────────────────────────────────────────┤
│  supabase.auth.admin.createUser({                       │
│    email,                                                │
│    password,                                             │
│    email_confirm: true,  // ⚠️ Pas d'email requis !    │
│    user_metadata: { first_name, last_name, role }       │
│  })                                                      │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  ÉTAPE 3 : Supabase Auth crée l'utilisateur           │
├─────────────────────────────────────────────────────────┤
│  1. Créé dans auth.users ✅                            │
│  2. Email confirmé automatiquement ✅                   │
│  3. Metadata stockées                                    │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  ÉTAPE 4 : Création MANUELLE du profil                │
├─────────────────────────────────────────────────────────┤
│  supabase.from('profiles').insert({                     │
│    id: authData.user.id,     // UUID de auth.users     │
│    email,                                                │
│    first_name,                                           │
│    last_name,                                            │
│    phone,                                                │
│    role                                                  │
│  })                                                      │
│                                                          │
│  ⚠️ ERREUR 23505 ignorée (duplicate key)               │
│  → Si le profil existe déjà, pas d'erreur              │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  ÉTAPE 5 : Résultat                                    │
├─────────────────────────────────────────────────────────┤
│  auth.users : ✅ Utilisateur existe                    │
│  profiles   : ✅ Profil créé MANUELLEMENT              │
│                                                          │
│  → L'utilisateur peut se connecter immédiatement       │
│  → Rôle correctement défini                             │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Solution : Créer le Schéma Database Supabase

### Tables Manquantes à Créer

```sql
-- 1. Table profiles (existe peut-être partiellement)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company_name TEXT,
  role TEXT NOT NULL DEFAULT 'visitor',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table documentation_purchases
CREATE TABLE IF NOT EXISTS documentation_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  document_id TEXT NOT NULL,
  document_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table coworking_subscriptions
CREATE TABLE IF NOT EXISTS coworking_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  payment_method TEXT,
  amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TRIGGER pour créer automatiquement le profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'visitor')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentation_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE coworking_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies (exemple pour profiles)
CREATE POLICY "Utilisateurs peuvent voir leur propre profil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins peuvent tout voir"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## ✅ Actions Immédiates Requises

### 1. Créer les Tables Manquantes
Allez sur : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/sql/new

Exécutez le SQL ci-dessus (sections 1-7).

### 2. Vérifier les Tables Existantes
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### 3. Tester une Requête
```sql
SELECT * FROM profiles LIMIT 5;
```

Si ça fonctionne → Les tables sont créées ✅
Si erreur 500 → Les tables n'existent toujours pas ❌

---

## 📊 Comparaison des Méthodes

| Aspect | Inscription Publique | Création Admin |
|--------|---------------------|----------------|
| **Accès** | Tout le monde | Admin uniquement |
| **Confirmation email** | ✅ Requise | ❌ Auto-confirmé |
| **Profil créé** | ❌ Dépend du trigger | ✅ Manuellement |
| **Rôle par défaut** | standard_client / coworking_client | Choisi par admin |
| **Sécurité** | ✅ Process normal | ⚠️ Bypass confirmation |

---

## 🎯 Recommandation Finale

**CRÉEZ D'ABORD LE SCHÉMA COMPLET DE LA BASE DE DONNÉES**

Sans les tables, rien ne fonctionnera dans le dashboard admin.

Une fois les tables créées :
1. Les erreurs 500 disparaîtront
2. L'inscription fonctionnera correctement
3. Le dashboard admin affichera les données
4. Le trigger créera automatiquement les profils

**Fichier SQL complet disponible sur demande.**
