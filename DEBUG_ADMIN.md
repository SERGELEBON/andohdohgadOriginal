# 🔍 DEBUG - Bouton Admin Invisible

## Problème
Le bouton "Admin" n'apparaît pas dans le header même après connexion avec le compte admin.

## Solutions implémentées

### 1. ✅ Debug Auth Component
Ajouté un composant de debug en bas à droite de l'écran (seulement en dev) qui affiche :
- État de connexion
- Email de l'utilisateur
- État du profil
- **Rôle actuel**
- Si admin ou non

**Position** : Coin inférieur droit de l'écran

### 2. ✅ Condition de fallback dans Header
Le bouton Admin s'affiche maintenant si :
- `profile.role === 'admin'` OU
- `user.email === 'contact@andoh-dohgad.com'`

Cela permet d'afficher le bouton même si le profil n'est pas encore chargé.

### 3. ✅ Admin Panel dédié
Nouvelle page `/admin-panel` avec :
- Design moderne (fond dégradé violet)
- 6 cartes d'accès rapide
- Lien vers `/admin` (dashboard stats)
- Liens vers futures sections (Users, Services, Blog, etc.)

### 4. ✅ Accès direct
Deux façons d'accéder à l'admin :
- `/admin` - Dashboard avec statistiques
- `/admin-panel` - Panneau de contrôle complet

## Tests à faire

### Test 1 : Vérifier le debug
1. Se connecter avec `contact@andoh-dohgad.com`
2. Regarder le coin inférieur droit de l'écran
3. ✅ Vérifier que "Role: admin" est affiché
4. ✅ Vérifier "👑 ADMIN ACCESS" est visible

### Test 2 : Vérifier le bouton Admin
1. Après connexion, regarder le header
2. ✅ Le bouton "👑 Admin" (violet) doit être visible
3. Cliquer dessus
4. ✅ Accès à `/admin` (Dashboard)

### Test 3 : Accès Admin Panel
1. Taper manuellement : `http://localhost:3000/admin-panel`
2. ✅ Accès au panneau de contrôle complet
3. ✅ Cliquer "Dashboard" pour aller sur `/admin`

## Commandes SQL pour vérifier le rôle

### Vérifier le profil
```sql
SELECT id, email, first_name, last_name, role, created_at
FROM profiles
WHERE email = 'contact@andoh-dohgad.com';
```

**Résultat attendu** : `role` = `'admin'`

### Si le rôle n'est pas admin
```sql
UPDATE profiles
SET role = 'admin',
    first_name = 'Admin',
    last_name = 'Andoh & Dohgad'
WHERE email = 'contact@andoh-dohgad.com';
```

### Vérifier tous les admins
```sql
SELECT email, role FROM profiles WHERE role = 'admin';
```

## Checklist de debug

- [ ] Le compte `contact@andoh-dohgad.com` existe dans Supabase Auth
- [ ] Le profil existe dans la table `profiles`
- [ ] Le rôle est bien `'admin'` (pas 'visitor', 'standard_client', etc.)
- [ ] Le composant debug affiche "Role: admin"
- [ ] Le composant debug affiche "👑 ADMIN ACCESS"
- [ ] Le bouton "👑 Admin" est visible dans le header
- [ ] Clic sur le bouton redirige vers `/admin`
- [ ] `/admin-panel` est accessible

## Console navigateur (F12)

Après connexion, taper dans la console :

```javascript
// Vérifier l'utilisateur
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);

// Vérifier le profil
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('email', 'contact@andoh-dohgad.com')
  .single();
console.log('Profile:', profile);
console.log('Role:', profile?.role);
```

**Résultat attendu** :
```
User: { email: "contact@andoh-dohgad.com", ... }
Profile: { ..., role: "admin", ... }
Role: "admin"
```

## Si le bouton n'apparaît toujours pas

### Cause 1 : Le profil ne se charge pas
**Solution** : Vérifier dans le debug component que "Profile: ✓ Loaded" est affiché

### Cause 2 : Le rôle n'est pas 'admin'
**Solution** : Exécuter le UPDATE SQL ci-dessus

### Cause 3 : La table profiles n'existe pas
**Solution** : Exécuter la migration `20260706000001_create_profiles.sql`

### Cause 4 : Cache navigateur
**Solution** : 
1. Vider le cache (Ctrl+Shift+R)
2. Déconnexion puis reconnexion
3. Ou navigation privée

## Accès direct en attendant

Même si le bouton n'apparaît pas, vous pouvez accéder directement :

- **Dashboard stats** : http://localhost:3000/admin
- **Admin Panel** : http://localhost:3000/admin-panel

Si vous êtes admin, l'accès sera autorisé.

## Contact en cas de problème

Vérifier :
1. Les logs dans la console navigateur (F12)
2. Le composant debug (coin inférieur droit)
3. Le résultat des requêtes SQL ci-dessus

