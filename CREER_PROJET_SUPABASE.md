# 🚀 GUIDE : CRÉER VOTRE PROJET SUPABASE

## 🎯 Problème actuel

L'URL `https://tszsvbzfufglvdcsjzpo.supabase.co` dans `.env.local` est un exemple fictif. Le projet n'existe pas, d'où l'erreur "Invalid API key".

## ✅ Solution : Créer votre propre projet

### Étape 1 : Créer le projet Supabase (5 min)

1. Aller sur **https://supabase.com/dashboard**

2. Se connecter (créer compte si nécessaire)

3. Cliquer **"New Project"**

4. Remplir le formulaire :
   - **Organization** : Choisir ou créer
   - **Name** : `andoh-dohgad-consulting`
   - **Database Password** : `Proud@#2026-` (IMPORTANT : noter ce mot de passe !)
   - **Region** : Choisir Europe (Frankfurt) ou le plus proche
   - **Pricing Plan** : Free

5. Cliquer **"Create new project"**

6. ⏱️ Attendre ~2 minutes (le projet se configure)

### Étape 2 : Récupérer vos clés (2 min)

Une fois le projet créé :

1. Menu **Settings** (⚙️ en bas à gauche)

2. Cliquer **API**

3. Copier ces 2 valeurs :

   **Project URL** (Configuration > URL)
   ```
   https://[VOTRE-REF-UNIQUE].supabase.co
   ```
   Exemple : `https://abcdefghijklmnop.supabase.co`

   **anon public** (Project API keys)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
   ```
   (très longue clé, ~200 caractères)

### Étape 3 : Mettre à jour .env.local (1 min)

Ouvrir `/home/serge/Téléchargements/dohgahnew/webandoh/.env.local`

**Remplacer :**
```env
VITE_SUPABASE_URL=https://tszsvbzfufglvdcsjzpo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...PLACEHOLDER
```

**Par vos vraies valeurs :**
```env
VITE_SUPABASE_URL=https://[VOTRE-REF-ICI].supabase.co
VITE_SUPABASE_ANON_KEY=[COLLER-VOTRE-LONGUE-CLÉ-ICI]
```

Sauvegarder le fichier.

### Étape 4 : Exécuter les migrations (10 min)

Dans Supabase Dashboard :

1. Menu **SQL Editor** (à gauche)

2. Cliquer **"New query"**

3. Ouvrir `/home/serge/Téléchargements/dohgahnew/supabase/migrations/20260706000001_create_profiles.sql`

4. Copier tout le contenu

5. Coller dans SQL Editor

6. Cliquer **"Run"** (ou Ctrl+Enter)

7. ✅ Vérifier "Success. No rows returned"

8. **Répéter pour TOUS les fichiers dans l'ordre** :
   - 20260706000001_create_profiles.sql ✅
   - 20260706000002_create_services.sql
   - 20260706000003_create_blog.sql
   - 20260706000004_create_documentation.sql
   - 20260706000005_create_appointments.sql
   - 20260706000006_create_coworking.sql
   - 20260706000007_create_surveys.sql
   - 20260706000008_create_contact_solutions.sql
   - 20260706000009_create_audit_logs.sql
   - 20260706000010_create_storage_buckets.sql

### Étape 5 : Créer le compte admin (2 min)

Dans Supabase Dashboard :

1. Menu **Authentication** > **Users**

2. Cliquer **"Add user"** > **"Create new user"**

3. Remplir :
   - **Email** : `contact@andoh-dohgad.com`
   - **Password** : `[Choisir un mot de passe fort]`
   - ✅ Cocher **"Auto Confirm User"**

4. Cliquer **"Create user"**

5. Le trigger PostgreSQL créera automatiquement le profil avec `role='admin'`

### Étape 6 : Tester (2 min)

```bash
# Redémarrer le serveur
npm run dev
```

1. Ouvrir http://localhost:3000/inscription

2. Créer un compte de test

3. ✅ Devrait fonctionner sans erreur "Invalid API key"

4. Se connecter avec le compte admin :
   - Email : `contact@andoh-dohgad.com`
   - Password : [celui choisi à l'étape 5]

5. ✅ Vérifier bouton "Admin" dans header

6. Aller sur /admin

7. ✅ Vérifier que les statistiques s'affichent

## 🧪 Vérification

### Test 1 : Vérifier l'URL

```bash
curl -I https://[VOTRE-REF].supabase.co
```

Devrait retourner : **HTTP/2 200** (pas 404 !)

### Test 2 : Vérifier la connexion

Console navigateur (F12) :
```javascript
import { supabase } from './src/lib/supabase/client';
const { error } = await supabase.auth.getSession();
console.log('Error:', error);
```

Devrait afficher : **null** (pas d'erreur)

### Test 3 : Vérifier les tables

Dans SQL Editor de Supabase :
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Devrait afficher 17 tables :
- appointments
- audit_logs
- blog_post_translations
- blog_posts
- contact_messages
- coworking_bookings
- coworking_spaces
- coworking_subscriptions
- documentation
- documentation_purchases
- documentation_translations
- profiles
- service_translations
- services
- solution_translations
- solutions
- surveys

## ⚠️ Points importants

1. **L'URL et la clé sont uniques** à VOTRE projet
2. **Ne partagez jamais** votre clé `service_role`
3. **Ne commitez jamais** .env.local dans Git
4. **Notez le mot de passe** de la base de données
5. **Exécutez TOUTES** les migrations dans l'ordre

## 🎉 Résultat final

Après ces étapes :
- ✅ Projet Supabase créé
- ✅ Base de données configurée
- ✅ Compte admin créé
- ✅ Application connectée
- ✅ Inscription fonctionne
- ✅ Connexion fonctionne
- ✅ Dashboard admin fonctionne

## 🆘 Si problème persiste

Vérifier dans l'ordre :
1. L'URL ne contient PAS "tszsvbzfufglvdcsjzpo" (c'est l'exemple)
2. La clé ne contient PAS "PLACEHOLDER"
3. `curl` sur l'URL retourne 200 (pas 404)
4. Les 10 migrations ont été exécutées
5. Le serveur a été redémarré après changement .env.local
