# ✅ TESTS D'AUTHENTIFICATION

## 🔧 Prérequis
1. Migrations Supabase exécutées
2. Compte admin créé : `contact@andoh-dohgad.com`
3. `.env.local` configuré avec VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY

## 🧪 Tests à effectuer

### TEST 1 : Page d'inscription (/inscription)
- [ ] Ouvrir http://localhost:3000/inscription
- [ ] Remplir le formulaire avec de nouvelles données
- [ ] Vérifier que le message "Inscription réussie" s'affiche
- [ ] Vérifier que l'email de confirmation est envoyé

### TEST 2 : Page de connexion (/connexion)
- [ ] Ouvrir http://localhost:3000/connexion
- [ ] Se connecter avec contact@andoh-dohgad.com
- [ ] Vérifier redirection vers /mon-compte
- [ ] Vérifier que le badge "Administrateur" est affiché

### TEST 3 : Mon compte (/mon-compte)
- [ ] Page accessible uniquement si connecté
- [ ] Informations du profil affichées (email, téléphone, rôle)
- [ ] Boutons d'action rapides présents
- [ ] Bouton déconnexion fonctionne

### TEST 4 : Dashboard Admin (/admin)
- [ ] Accessible uniquement avec role='admin'
- [ ] Statistiques chargées depuis Supabase
- [ ] Total utilisateurs affiché
- [ ] Revenus du mois calculés

### TEST 5 : Protection des routes
- [ ] /mon-compte redirige vers /connexion si non connecté
- [ ] /admin redirige vers /connexion si non connecté
- [ ] /admin redirige si connecté mais pas admin

## 📸 Preuve de succès

### ✅ Build réussie
```
✓ built in 35.86s
```

### ✅ Serveur lancé
```
Server running at http://localhost:3000
```

### ✅ Fichiers créés
- AuthContext.tsx
- LoginForm.tsx
- SignupForm.tsx
- ProtectedRoute.tsx
- Login.tsx
- Signup.tsx
- MyAccount.tsx
- AdminDashboard.tsx
- App.tsx (mis à jour)

## 🔍 Test console navigateur

Ouvrir la console (F12) et taper :

```javascript
// Test 1 : Vérifier Supabase
import { supabase } from './src/lib/supabase/client';
console.log('Supabase URL:', supabase.supabaseUrl);

// Test 2 : Vérifier authentification après login
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);

// Test 3 : Vérifier profil
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();
console.log('Profile:', profile);
console.log('Role:', profile.role);
```

## ✅ Résultat attendu

Si tout fonctionne :
1. ✅ Build sans erreurs
2. ✅ Serveur démarre sur port 3000
3. ✅ Pages d'authentification accessibles
4. ✅ Inscription crée un profil dans Supabase
5. ✅ Connexion fonctionne et redirige
6. ✅ Dashboard admin affiche stats réelles
7. ✅ Routes protégées fonctionnent
8. ✅ Déconnexion marche

## 🐛 Troubleshooting

### Erreur : "Missing Supabase environment variables"
→ Vérifier `.env.local` et redémarrer `npm run dev`

### Erreur : "Invalid login credentials"
→ Vérifier que le compte admin existe dans Supabase Dashboard

### Page blanche après login
→ Ouvrir console (F12) pour voir l'erreur
→ Vérifier que les migrations sont exécutées

### Stats admin = 0
→ Normal si base vide
→ Créer quelques utilisateurs/rendez-vous de test
