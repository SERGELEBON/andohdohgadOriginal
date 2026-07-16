# Comment Définir le Rôle Admin Manuellement

## Problème
Vous êtes connecté mais avec le rôle "Visiteur" au lieu d'"Admin".

## Solution 1 : Via Supabase Dashboard (Recommandé)

1. **Allez sur Supabase Dashboard :**
   https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/editor

2. **Cliquez sur "Table Editor" → Sélectionnez la table "profiles"**

3. **Trouvez votre utilisateur (email: contact@andoh-dohgad.com)**

4. **Modifiez la colonne "role" :**
   - Cliquez sur la cellule "role"
   - Changez de `visitor` à `admin`
   - Sauvegardez

5. **Déconnectez-vous et reconnectez-vous sur le site**

## Solution 2 : Via SQL Editor

1. **Allez sur :** https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/sql/new

2. **Exécutez cette requête SQL :**

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'contact@andoh-dohgad.com';
```

3. **Cliquez sur "Run"**

4. **Déconnectez-vous et reconnectez-vous sur le site**

## Solution 3 : Via /super-admin

1. **Déconnectez-vous complètement du site**

2. **Allez sur :** https://andoh-dohgad.netlify.app/super-admin

3. **La page va automatiquement :**
   - Se connecter avec les identifiants admin
   - Mettre à jour le rôle à "admin"
   - Vous rediriger vers /admin

## Vérification

Après avoir défini le rôle admin :

1. Allez sur : https://andoh-dohgad.netlify.app/connexion
2. Connectez-vous avec :
   - Email: contact@andoh-dohgad.com
   - Mot de passe: SuperAdmin@2026!
3. Vous devriez être redirigé vers /admin (pas /mon-compte)

## Notes

- Le rôle par défaut pour les nouveaux utilisateurs est "visitor"
- Seuls les comptes créés via /super-admin ou modifiés manuellement ont le rôle "admin"
- Si vous allez sur /mon-compte étant admin, vous serez automatiquement redirigé vers /admin
