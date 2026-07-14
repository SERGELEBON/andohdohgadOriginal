# 🧪 TEST D'AUTHENTIFICATION - GUIDE COMPLET

**Projet** : Andoh & Dohgad Consulting  
**URL** : http://localhost:3001  
**Date** : 14 juillet 2026

---

## ✅ CONFIGURATION ACTUELLE

### Supabase ✅
- ✅ URL : https://tszsvbzfufglvdcsjzpo.supabase.co
- ✅ ANON_KEY : Configurée
- ✅ SERVICE_ROLE_KEY : Configurée
- ✅ Tables : Créées (confirmation utilisateur)

### Composants ✅
- ✅ AuthContext configuré
- ✅ Client Supabase initialisé
- ✅ LoginForm opérationnel
- ✅ SignupForm disponible

---

## 🧪 TESTS À EFFECTUER

### Test 1 : Accès aux pages d'authentification

#### Page de connexion
```
URL : http://localhost:3001/connexion
```

**Vérifications** :
- [ ] La page s'affiche sans erreur
- [ ] Le formulaire est visible
- [ ] Champs Email et Mot de passe présents
- [ ] Bouton "Se connecter" visible
- [ ] Lien "S'inscrire" fonctionne

#### Page d'inscription
```
URL : http://localhost:3001/inscription
```

**Vérifications** :
- [ ] La page s'affiche sans erreur
- [ ] Le formulaire est visible
- [ ] Tous les champs sont présents
- [ ] Bouton "S'inscrire" visible
- [ ] Lien "Se connecter" fonctionne

---

### Test 2 : Console du navigateur (vérifier les variables)

1. **Ouvrir les DevTools**
   - Appuyer sur `F12`
   - Ou clic droit → Inspecter

2. **Aller dans l'onglet Console**

3. **Taper ces commandes** :

```javascript
// Test 1 : Vérifier l'URL Supabase
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
// Attendu : https://tszsvbzfufglvdcsjzpo.supabase.co

// Test 2 : Vérifier la clé ANON
console.log('ANON Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 30) + '...')
// Attendu : eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...

// Test 3 : Vérifier que la clé n'est pas PLACEHOLDER
console.log('Clé valide:', !import.meta.env.VITE_SUPABASE_ANON_KEY?.includes('PLACEHOLDER'))
// Attendu : true
```

**Résultats attendus** :
```
Supabase URL: https://tszsvbzfufglvdcsjzpo.supabase.co
ANON Key: eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...
Clé valide: true
```

Si vous voyez `undefined` ou `PLACEHOLDER` → Problème de configuration

---

### Test 3 : Test de connexion Supabase (Console)

Dans la console du navigateur :

```javascript
// Importer le client Supabase
import { supabase } from './src/lib/supabase/client.js'

// Test de connexion à la base de données
const testConnection = async () => {
  try {
    // Test 1 : Ping de base
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Erreur de connexion:', error.message)
      return false
    }
    
    console.log('✅ Connexion Supabase OK')
    return true
  } catch (err) {
    console.error('❌ Erreur:', err)
    return false
  }
}

// Exécuter le test
await testConnection()
```

**Résultats possibles** :

✅ **Succès** :
```
✅ Connexion Supabase OK
```

❌ **Échec - Clé invalide** :
```
❌ Erreur de connexion: Invalid API key
```
→ Solution : Vérifier VITE_SUPABASE_ANON_KEY dans .env.local

❌ **Échec - Table inexistante** :
```
❌ Erreur de connexion: relation "profiles" does not exist
```
→ Solution : Exécuter les migrations SQL

❌ **Échec - RLS Policy** :
```
❌ Erreur de connexion: permission denied for table profiles
```
→ Solution : Vérifier les policies RLS dans Supabase

---

### Test 4 : Créer un compte de test

#### Via l'interface web

1. **Aller sur** : http://localhost:3001/inscription

2. **Remplir le formulaire** :
   ```
   Prénom : Test
   Nom : Utilisateur
   Email : test@example.com
   Téléphone : +225 0123456789
   Mot de passe : Test123456!
   Confirmer mot de passe : Test123456!
   ```

3. **Cliquer sur "S'inscrire"**

**Résultats possibles** :

✅ **Succès** :
- Compte créé
- Redirection vers /mon-compte
- Message de confirmation d'email (si configuré)

❌ **Erreur : "Invalid email"** :
- Vérifier le format de l'email
- Essayer avec un autre email

❌ **Erreur : "User already registered"** :
- L'email est déjà utilisé
- Utiliser un autre email ou se connecter

❌ **Erreur : "Email not confirmed"** :
- Supabase attend la confirmation d'email
- Aller dans Supabase → Authentication → Users
- Confirmer manuellement l'email

❌ **Erreur console : "Invalid API key"** :
- Clé ANON_KEY incorrecte
- Vérifier .env.local

---

### Test 5 : Se connecter avec le compte créé

1. **Aller sur** : http://localhost:3001/connexion

2. **Entrer les identifiants** :
   ```
   Email : test@example.com
   Mot de passe : Test123456!
   ```

3. **Cliquer sur "Se connecter"**

**Résultats possibles** :

✅ **Succès** :
- Connexion réussie
- Redirection vers /mon-compte
- Navbar affiche "Mon compte" ou avatar

❌ **Erreur : "Invalid login credentials"** :
- Email ou mot de passe incorrect
- Vérifier les identifiants
- Vérifier que le compte est confirmé

❌ **Erreur : "Email not confirmed"** :
- Aller dans Supabase Dashboard
- Authentication → Users
- Cliquer sur l'utilisateur
- Confirmer manuellement l'email

---

### Test 6 : Vérifier la session (Console)

Après connexion, dans la console :

```javascript
// Importer le client
import { supabase } from './src/lib/supabase/client.js'

// Vérifier la session active
const checkSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('❌ Erreur:', error)
    return
  }
  
  if (session) {
    console.log('✅ Session active')
    console.log('User ID:', session.user.id)
    console.log('Email:', session.user.email)
    console.log('Expire à:', new Date(session.expires_at * 1000))
  } else {
    console.log('❌ Pas de session active')
  }
}

await checkSession()
```

**Résultat attendu** :
```
✅ Session active
User ID: 123e4567-e89b-12d3-a456-426614174000
Email: test@example.com
Expire à: Mon Jul 15 2026 02:45:00
```

---

### Test 7 : Vérifier le profil utilisateur

```javascript
import { supabase } from './src/lib/supabase/client.js'

const checkProfile = async () => {
  // Récupérer l'utilisateur actuel
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.log('❌ Pas connecté')
    return
  }
  
  // Récupérer le profil
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (error) {
    console.error('❌ Erreur profil:', error.message)
    return
  }
  
  console.log('✅ Profil trouvé:', profile)
}

await checkProfile()
```

**Résultat attendu** :
```
✅ Profil trouvé: {
  id: "123e4567-e89b-12d3-a456-426614174000",
  email: "test@example.com",
  first_name: "Test",
  last_name: "Utilisateur",
  role: "visitor",
  created_at: "2026-07-14T02:45:00Z"
}
```

---

### Test 8 : Pages protégées

#### Mon compte (protégé)
```
URL : http://localhost:3001/mon-compte
```

**Sans connexion** :
- [ ] Redirection vers /connexion
- [ ] Message "Vous devez être connecté"

**Avec connexion** :
- [ ] Page s'affiche
- [ ] Informations utilisateur visibles
- [ ] Bouton déconnexion présent

#### Dashboard admin (protégé + rôle admin)
```
URL : http://localhost:3001/admin
```

**Avec compte standard** :
- [ ] Accès refusé
- [ ] Redirection ou message d'erreur

**Avec compte admin** :
- [ ] Dashboard s'affiche
- [ ] Statistiques visibles
- [ ] Menu admin accessible

---

### Test 9 : Déconnexion

1. Cliquer sur "Déconnexion" (dans le menu ou profil)

**Vérifications** :
- [ ] Redirection vers /
- [ ] Session supprimée
- [ ] Menu revient à l'état déconnecté
- [ ] Impossible d'accéder à /mon-compte

---

## 🐛 PROBLÈMES COURANTS ET SOLUTIONS

### Problème 1 : "Invalid API key"

**Symptômes** :
- Erreur dans la console
- Impossible de se connecter
- Erreur 401 Unauthorized

**Solutions** :
```bash
# 1. Vérifier la clé dans .env.local
cat .env.local | grep VITE_SUPABASE_ANON_KEY

# 2. S'assurer qu'elle ne contient pas PLACEHOLDER
# 3. S'assurer qu'elle commence par eyJhbGci
# 4. Redémarrer le serveur
lsof -ti:3001 | xargs kill -9
npm run dev
```

### Problème 2 : "relation 'profiles' does not exist"

**Symptômes** :
- Erreur lors de l'inscription
- Erreur lors de la récupération du profil

**Solution** :
```
Les migrations SQL ne sont pas exécutées

1. Aller sur : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/sql/new
2. Exécuter les migrations dans l'ordre (001 à 013)
3. Vérifier dans Table Editor que "profiles" existe
```

### Problème 3 : "Email not confirmed"

**Symptômes** :
- Compte créé mais impossible de se connecter
- Message "Email not confirmed"

**Solution** :
```
1. Aller sur : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/auth/users
2. Trouver l'utilisateur dans la liste
3. Cliquer sur les 3 points (...)
4. Cliquer sur "Confirm email"
5. Réessayer de se connecter
```

### Problème 4 : "Permission denied for table profiles"

**Symptômes** :
- Erreur RLS (Row Level Security)
- Impossible de lire/écrire dans profiles

**Solution** :
```
Vérifier les policies RLS :

1. Aller sur : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/auth/policies
2. Table "profiles"
3. Vérifier qu'il existe des policies :
   - INSERT : allow_insert_own_profile
   - SELECT : allow_select_own_profile
   - UPDATE : allow_update_own_profile
4. Si absent, exécuter le fichier de migration profiles
```

### Problème 5 : Variables d'environnement non chargées

**Symptômes** :
- `import.meta.env.VITE_SUPABASE_URL` retourne `undefined`
- Console affiche des undefined

**Solution** :
```bash
# 1. Vérifier que les variables commencent par VITE_
cat .env.local | grep VITE_

# 2. Redémarrer le serveur (obligatoire après modif .env)
lsof -ti:3001 | xargs kill -9
npm run dev

# 3. Vider le cache du navigateur
Ctrl + Shift + R (Chrome/Firefox)
```

---

## ✅ CHECKLIST COMPLÈTE

### Configuration
- [x] Supabase URL configurée
- [x] ANON_KEY configurée
- [x] SERVICE_ROLE_KEY configurée
- [ ] Migrations SQL exécutées
- [x] Serveur redémarré

### Tests de base
- [ ] Page /connexion accessible
- [ ] Page /inscription accessible
- [ ] Variables d'environnement chargées (console)
- [ ] Connexion Supabase OK (console)

### Tests d'inscription
- [ ] Formulaire d'inscription fonctionne
- [ ] Compte créé dans Supabase
- [ ] Email confirmé (manuellement ou auto)
- [ ] Profil créé dans table profiles

### Tests de connexion
- [ ] Connexion réussie
- [ ] Session active (console)
- [ ] Profil chargé (console)
- [ ] Redirection vers /mon-compte

### Tests de navigation
- [ ] Page /mon-compte accessible après login
- [ ] Page /admin bloquée pour non-admin
- [ ] Déconnexion fonctionne
- [ ] Redirection après déconnexion

---

## 📊 RAPPORT DE TEST

Remplissez après vos tests :

```
Date du test : _____________
Testeur : _____________

✅ Tests réussis : ___/15
❌ Tests échoués : ___/15
⏭️ Tests non effectués : ___/15

Problèmes rencontrés :
1. ________________________________
2. ________________________________
3. ________________________________

Solutions appliquées :
1. ________________________________
2. ________________________________
3. ________________________________

Statut final : ☐ OK  ☐ Avec problèmes  ☐ Non fonctionnel
```

---

## 🎯 PROCHAINES ÉTAPES APRÈS LES TESTS

Si tous les tests passent ✅ :
1. Créer un compte admin (via SQL)
2. Tester le dashboard admin
3. Configurer EmailJS pour les formulaires
4. Configurer Stripe pour les paiements

Si des tests échouent ❌ :
1. Noter les erreurs exactes
2. Consulter la section "Problèmes courants"
3. Vérifier les logs dans la console
4. Vérifier les logs dans Supabase Dashboard

---

**Prêt pour les tests ? Commencez par Test 1 !** 🚀
