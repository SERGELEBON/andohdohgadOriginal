# 🔍 DIAGNOSTIC COMPLET - Bouton Admin + Accès Routes

## 🎯 Problèmes identifiés

1. **Bouton Admin invisible** dans le header
2. **Redirection vers `/connexion`** lors de l'accès à `/admin`

## 📊 PAGE DE TEST CRÉÉE

Une page de diagnostic complète a été créée : **`/test-auth`**

### Accès
```
http://localhost:3000/test-auth
```

### Ce qu'elle affiche

```
┌─────────────────────────────────────────────────────────┐
│ 🔍 Test Authentication State                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Loading State                                           │
│ • Loading: FALSE (ready) / TRUE (still loading...)      │
│                                                         │
│ User State                                              │
│ • User Object: ✓ EXISTS / ✗ NULL                       │
│   ├─ ID: uuid                                          │
│   ├─ Email: contact@andoh-dohgad.com                   │
│   └─ Created: date                                     │
│                                                         │
│ Profile State                                           │
│ • Profile Object: ✓ EXISTS / ✗ NULL                    │
│   ├─ Email: contact@andoh-dohgad.com                   │
│   ├─ First Name: Admin                                 │
│   ├─ Last Name: Andoh & Dohgad                         │
│   └─ Role: admin / visitor / standard_client           │
│                                                         │
│ 👑 Admin Status                                         │
│ • Is Admin (role check): ✓ YES - ADMIN / ✗ NO         │
│ • Email check: ✓ Super Admin Email / ✗ Regular        │
│ • Header Button Should Show: ✓ YES / ✗ NO             │
│                                                         │
│ [Actions]                                               │
│ • Go to Home                                            │
│ • Go to Login                                           │
│ • Go to My Account (Protected)                          │
│ • Go to Admin (Admin Only)                              │
└─────────────────────────────────────────────────────────┘
```

## 🧪 ÉTAPES DE DIAGNOSTIC

### Étape 1 : Accéder à la page de test

1. Ouvrir le navigateur
2. Aller sur : http://localhost:3000/test-auth
3. **PRENDRE UNE CAPTURE D'ÉCRAN**

### Étape 2 : Analyser les résultats

#### CAS 1 : User: ✗ NULL
**Signification** : Vous n'êtes pas connecté

**Solution** :
1. Cliquer sur "Go to Login"
2. Se connecter avec `contact@andoh-dohgad.com`
3. Revenir sur `/test-auth`

#### CAS 2 : User: ✓ EXISTS mais Profile: ✗ NULL
**Signification** : L'utilisateur existe mais le profil ne se charge pas

**Causes possibles** :
- La table `profiles` n'existe pas
- Le profil n'a pas été créé pour cet utilisateur

**Solution** :

A. Vérifier que la table existe :
```sql
-- Dans Supabase SQL Editor
SELECT * FROM information_schema.tables 
WHERE table_name = 'profiles';
```

B. Si la table n'existe pas, exécuter :
```sql
-- Exécuter la migration complète
-- Fichier : supabase/migrations/20260706000001_create_profiles.sql
```

C. Si la table existe mais pas le profil :
```sql
-- Créer le profil manuellement
INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    created_at,
    updated_at
)
SELECT 
    id,
    email,
    'Admin',
    'Andoh & Dohgad',
    'admin',
    now(),
    now()
FROM auth.users
WHERE email = 'contact@andoh-dohgad.com';
```

#### CAS 3 : Profile: ✓ EXISTS mais Role: visitor
**Signification** : Le profil existe mais le rôle n'est pas admin

**Solution** :
```sql
-- Dans Supabase SQL Editor
UPDATE profiles 
SET role = 'admin',
    first_name = 'Admin',
    last_name = 'Andoh & Dohgad',
    updated_at = now()
WHERE email = 'contact@andoh-dohgad.com';

-- Vérifier
SELECT email, role, first_name FROM profiles 
WHERE email = 'contact@andoh-dohgad.com';
```

#### CAS 4 : Tout correct mais bouton invisible
**Signification** : Le profil est admin mais le bouton ne s'affiche pas

**Solutions** :
1. Vider le cache navigateur : `Ctrl + Shift + R`
2. Se déconnecter puis reconnecter
3. Essayer en navigation privée
4. Redémarrer le serveur : `Ctrl+C` puis `npm run dev`

### Étape 3 : Vérifier le Header

Après avoir corrigé les problèmes ci-dessus :

1. Aller sur la page d'accueil : http://localhost:3000
2. Se connecter si nécessaire
3. **Regarder le header en haut à droite**

**Résultat attendu** :
```
[Logo]                              [LanguageSwitcher] [Admin 👑 Admin] [Mon compte] [🚪]
                                                       └─ Bouton violet
```

Si le bouton "👑 Admin" n'est pas visible :
- Revenir sur `/test-auth`
- Vérifier "Header Button Should Show"
- Si c'est "✓ YES" mais pas de bouton → Problème de cache

### Étape 4 : Tester l'accès `/admin`

1. Dans le navigateur, taper : http://localhost:3000/admin

**Résultat attendu** :
- ✅ Accès au dashboard avec 6 statistiques
- ✅ Titre "Tableau de bord Admin"
- ✅ Pas de redirection vers `/connexion`

**Si redirection vers `/connexion`** :
- Revenir sur `/test-auth`
- Vérifier que "User: ✓ EXISTS"
- Si User est NULL → Se reconnecter

### Étape 5 : Tester l'accès `/admin-panel`

1. Dans le navigateur, taper : http://localhost:3000/admin-panel

**Résultat attendu** :
- ✅ Accès au panneau avec fond dégradé violet
- ✅ 6 cartes d'administration
- ✅ Pas de redirection

## 🔧 CORRECTIFS APPLIQUÉS

### 1. Composant DebugAuth
**Fichier** : `src/components/auth/DebugAuth.tsx`
- Affiche l'état auth en temps réel
- Position : Coin inférieur droit
- Visible uniquement en dev

### 2. Header amélioré
**Fichier** : `src/components/layout/Header.tsx`
```tsx
{(profile?.role === 'admin' || user?.email === 'contact@andoh-dohgad.com') && (
  <Link to="/admin" className="...">
    👑 Admin
  </Link>
)}
```
- Condition double pour robustesse
- Affiche même si profil pas chargé (fallback email)

### 3. Page TestAuth
**Fichier** : `src/pages/TestAuth.tsx`
**Route** : `/test-auth`
- Diagnostic complet de l'état auth
- Affichage clair des problèmes
- Actions rapides pour tester

### 4. ProtectedRoute
**Fichier** : `src/components/auth/ProtectedRoute.tsx`
- Vérifie `user` d'abord
- Si pas de user → redirection `/connexion`
- Puis vérifie `role` si `allowedRoles` spécifié

## 📸 CAPTURES D'ÉCRAN À FOURNIR

### Capture 1 : Page /test-auth (APRÈS CONNEXION)
**Important** : Cette capture doit montrer :
- User: ✓ EXISTS
- Profile: ✓ EXISTS
- Role: admin
- Admin Status: ✓ YES - ADMIN
- Header Button Should Show: ✓ YES

### Capture 2 : Header de la page d'accueil
**Important** : Cette capture doit montrer :
- Bouton "👑 Admin" visible (violet)
- Nom "Admin" affiché
- Autres boutons (Mon compte, déconnexion)

### Capture 3 : Page /admin
**Important** : Cette capture doit montrer :
- Dashboard avec 6 statistiques
- Titre "Tableau de bord Admin"
- Pas de redirection

### Capture 4 : Page /admin-panel
**Important** : Cette capture doit montrer :
- Fond dégradé violet
- 6 cartes d'administration
- Titre "👑 Admin Panel"

## 🔬 DEBUG VIA CONSOLE NAVIGATEUR

Ouvrir la console (F12) et taper :

```javascript
// Test 1 : Vérifier Supabase
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);

// Test 2 : Vérifier User
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);

// Test 3 : Vérifier Profile
if (user) {
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
    console.log('Profile:', profile);
    console.log('Role:', profile?.role);
}
```

**Résultats attendus** :
```
Session: { access_token: "...", user: {...}, ... }
User: { id: "...", email: "contact@andoh-dohgad.com", ... }
Profile: { id: "...", email: "...", role: "admin", ... }
Role: "admin"
```

## ✅ CHECKLIST FINALE

Avant de dire que c'est résolu, vérifier :

- [ ] Page `/test-auth` accessible
- [ ] User: ✓ EXISTS affiché sur `/test-auth`
- [ ] Profile: ✓ EXISTS affiché sur `/test-auth`
- [ ] Role: admin affiché sur `/test-auth`
- [ ] "Header Button Should Show: ✓ YES" sur `/test-auth`
- [ ] Bouton "👑 Admin" visible dans le header de n'importe quelle page
- [ ] Clic sur bouton "👑 Admin" redirige vers `/admin`
- [ ] Page `/admin` accessible (pas de redirection)
- [ ] Page `/admin-panel` accessible (pas de redirection)
- [ ] Les 6 statistiques s'affichent sur `/admin`
- [ ] Composant DebugAuth visible en bas à droite (dev seulement)

## 🚨 SI TOUJOURS PAS RÉSOLU

1. **Fournir les captures d'écran** de `/test-auth` APRÈS connexion
2. **Copier le JSON** affiché dans "Show Raw JSON" sur `/test-auth`
3. **Copier les résultats** des commandes SQL de vérification
4. **Copier les logs** de la console navigateur (F12)

Avec ces informations, je pourrai identifier le problème exact.

---

**Date** : 6 juillet 2026  
**Fichier de test** : `/test-auth`  
**Documentation** : `DIAGNOSTIC_ADMIN_COMPLET.md`
