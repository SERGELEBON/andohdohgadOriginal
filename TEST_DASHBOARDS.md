# 🧪 TESTS DES DASHBOARDS PAR RÔLE

## 📋 Vue d'ensemble

Le système d'authentification implémente 4 rôles :
- **admin** : Accès complet + dashboard admin
- **coworking_client** : Accès co-working + dashboard standard
- **standard_client** : Accès services payants + dashboard standard
- **visitor** : Accès limité + dashboard standard

## 🔐 PHASE 1 : Créer le compte admin

### Étape 1 : Créer l'utilisateur dans Supabase Auth

1. Aller sur : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/auth/users

2. Cliquer **"Add user"** > **"Create new user"**

3. Remplir :
   - **Email** : `contact@andoh-dohgad.com`
   - **Password** : [Choisir un mot de passe fort, ex: `Admin@2026!`]
   - ✅ **Cocher "Auto Confirm User"**

4. Cliquer **"Create user"**

5. ✅ Noter l'UUID de l'utilisateur créé (visible dans la liste)

### Étape 2 : Définir le rôle admin

1. Aller sur : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/sql/new

2. **Option A : Si le profil existe déjà** (créé par trigger)
   ```sql
   -- Mettre à jour le profil existant
   UPDATE profiles 
   SET role = 'admin',
       first_name = 'Admin',
       last_name = 'Andoh & Dohgad',
       updated_at = now()
   WHERE email = 'contact@andoh-dohgad.com';
   ```

3. **Option B : Si le profil n'existe pas**
   ```sql
   -- Récupérer l'UUID de l'utilisateur
   SELECT id FROM auth.users WHERE email = 'contact@andoh-dohgad.com';
   
   -- Créer le profil manuellement (remplacer [UUID] par l'ID obtenu)
   INSERT INTO profiles (
       id,
       email,
       first_name,
       last_name,
       role,
       created_at,
       updated_at
   ) VALUES (
       '[UUID]'::uuid,
       'contact@andoh-dohgad.com',
       'Admin',
       'Andoh & Dohgad',
       'admin',
       now(),
       now()
   );
   ```

4. Cliquer **"Run"**

5. ✅ Vérifier le message "Success"

### Étape 3 : Vérifier le profil admin

```sql
SELECT id, email, first_name, last_name, role, created_at
FROM profiles
WHERE email = 'contact@andoh-dohgad.com';
```

✅ **Résultat attendu** :
- `role` = `'admin'`
- `first_name` = `'Admin'`
- `last_name` = `'Andoh & Dohgad'`

## 🧪 PHASE 2 : Tests des dashboards

### TEST 1 : Dashboard Admin (/admin)

#### Se connecter en tant qu'admin

1. Aller sur : http://localhost:3000/connexion

2. Remplir :
   - Email : `contact@andoh-dohgad.com`
   - Password : [celui choisi à l'étape 1]

3. Cliquer **"Se connecter"**

#### Vérifications après connexion

**Header** :
- ✅ Nom "Admin" affiché en haut à droite
- ✅ Bouton **"Admin"** visible (violet)
- ✅ Bouton **"Mon compte"** visible
- ✅ Icône déconnexion visible

**Redirection** :
- ✅ Redirigé automatiquement vers `/mon-compte`

**Page Mon compte** :
- ✅ Badge **"Administrateur"** (violet/pourpre)
- ✅ Informations profil affichées
- ✅ Actions rapides présentes

#### Accéder au dashboard admin

1. Cliquer sur le bouton **"Admin"** dans le header

2. ✅ Accès à `/admin` sans blocage

**Page Dashboard Admin** :

```
┌─────────────────────────────────────────────────────────────┐
│  TABLEAU DE BORD ADMIN                                      │
│  Bienvenue Admin, voici un aperçu de votre activité         │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 👥 X         │  │ 📅 X         │  │ 📋 X         │
│ Utilisateurs │  │ RDV en       │  │ Sondages non │
│ total        │  │ attente      │  │ traités      │
└──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 💬 X         │  │ 💰 X F       │  │ 📈 X         │
│ Messages non │  │ Revenus du   │  │ Abonnements  │
│ lus          │  │ mois         │  │ actifs       │
└──────────────┘  └──────────────┘  └──────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Actions rapides                                             │
│ [Gérer Services] [Gérer Blog] [Gérer Docs] [Voir Sondages]│
└─────────────────────────────────────────────────────────────┘
```

**Vérifications** :
- ✅ 6 cartes de statistiques affichées
- ✅ Chiffres chargés depuis Supabase (peuvent être 0 si base vide)
- ✅ 4 boutons d'actions rapides
- ✅ Design cohérent avec le reste du site
- ✅ Pas d'erreur dans la console (F12)

### TEST 2 : Dashboard utilisateur standard (/mon-compte)

#### Créer un compte standard

1. Se déconnecter (bouton dans header)

2. Aller sur : http://localhost:3000/inscription

3. Créer un compte :
   - Prénom : `Test`
   - Nom : `Standard`
   - Email : `standard@test.com`
   - Téléphone : `+225 07 12 34 56 78`
   - Mot de passe : `test1234`

4. ✅ Inscription réussie

#### Se connecter avec le compte standard

1. Aller sur : http://localhost:3000/connexion

2. Se connecter avec `standard@test.com` / `test1234`

3. ✅ Redirection vers `/mon-compte`

**Header** :
- ✅ Nom "Test" affiché
- ✅ **PAS de bouton "Admin"** (important !)
- ✅ Bouton "Mon compte" visible
- ✅ Icône déconnexion visible

**Page Mon compte** :

```
┌─────────────────────────────────────────────────────────────┐
│  MON COMPTE                                                 │
│  Gérez vos informations et vos services                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌─────────────────────────────────────────┐
│ 👤 Test      │  │ Informations personnelles               │
│              │  │                                         │
│ [Visiteur]   │  │ ✉️ Email: standard@test.com            │ ← Badge gris
│              │  │ 📱 Téléphone: +225 07 12 34 56 78      │
│  • Profil    │  │ 🛡️ Type: Visiteur                      │
│  • Déconnexion│  └─────────────────────────────────────────┘
└──────────────┘
                  ┌─────────────────────────────────────────┐
                  │ Actions rapides                         │
                  │ [📅 Prendre RDV] [📄 Documentation]     │
                  └─────────────────────────────────────────┘
```

**Vérifications** :
- ✅ Badge **"Visiteur"** (gris)
- ✅ Informations correctes (nom, email, téléphone)
- ✅ Actions rapides adaptées (pas d'action admin)
- ✅ Déconnexion fonctionne

### TEST 3 : Protection des routes

#### Test A : Accès non authentifié

1. Se déconnecter

2. Essayer d'accéder à http://localhost:3000/mon-compte
   - ✅ Redirigé vers `/connexion`

3. Essayer d'accéder à http://localhost:3000/admin
   - ✅ Redirigé vers `/connexion`

#### Test B : Accès utilisateur standard vers admin

1. Se connecter avec le compte standard (`standard@test.com`)

2. Essayer d'accéder à http://localhost:3000/admin
   - ✅ Redirigé vers `/` (accueil) OU message "Accès refusé"

3. Vérifier qu'il n'y a PAS de bouton "Admin" dans le header
   - ✅ Pas de bouton visible

#### Test C : Accès admin

1. Se connecter avec le compte admin (`contact@andoh-dohgad.com`)

2. Accéder à http://localhost:3000/admin
   - ✅ Accès autorisé, dashboard admin affiché

3. Accéder à http://localhost:3000/mon-compte
   - ✅ Accès autorisé, dashboard standard affiché avec badge "Administrateur"

## 🔍 PHASE 3 : Tests avancés

### Test des statistiques admin

#### Créer des données de test

Dans Supabase SQL Editor :

```sql
-- 1. Créer quelques rendez-vous
INSERT INTO appointments (user_id, service, appointment_date, time_slot, status)
SELECT
    id,
    'Consultation fiscale',
    CURRENT_DATE + INTERVAL '7 days',
    '10:00',
    'pending'
FROM profiles
WHERE email != 'contact@andoh-dohgad.com'
LIMIT 2;

-- 2. Créer des sondages
INSERT INTO surveys (user_id, survey_type, responses, status)
SELECT
    id,
    'besoins_entreprise',
    '{"q1": "r1"}'::jsonb,
    'new'
FROM profiles
WHERE email != 'contact@andoh-dohgad.com'
LIMIT 3;

-- 3. Créer des messages
INSERT INTO contact_messages (full_name, email, subject, message, status)
VALUES
    ('Test User', 'test@example.com', 'Question', 'Message test', 'new'),
    ('John Doe', 'john@example.com', 'Info', 'Autre message', 'new');
```

#### Vérifier le dashboard admin

1. Rafraîchir la page `/admin`

2. ✅ Les statistiques doivent refléter les données créées :
   - Total utilisateurs : >= 2
   - RDV en attente : 2
   - Sondages non traités : 3
   - Messages non lus : 2
   - Revenus du mois : 0 (normal si aucun achat)
   - Abonnements actifs : 0 (normal)

### Test de la console (erreurs)

1. Ouvrir la console navigateur (F12)

2. Naviguer entre les pages :
   - `/` → `/connexion` → `/mon-compte` → `/admin`

3. ✅ Aucune erreur JavaScript
4. ✅ Aucune erreur 404 ou 500
5. ✅ Requêtes Supabase réussies (status 200)

### Test de performance

1. Charger `/admin` (dashboard admin)

2. ✅ Chargement < 2 secondes
3. ✅ Pas de latence visible
4. ✅ Statistiques s'affichent rapidement

## 📊 PHASE 4 : Matrice de tests

| Rôle | /connexion | /inscription | /mon-compte | /admin | Bouton Admin |
|------|-----------|--------------|-------------|---------|--------------|
| **Non connecté** | ✅ | ✅ | ❌ → /connexion | ❌ → /connexion | ❌ |
| **Visitor** | ✅ | ✅ | ✅ Badge gris | ❌ → / | ❌ |
| **Standard** | ✅ | ✅ | ✅ Badge gris | ❌ → / | ❌ |
| **Coworking** | ✅ | ✅ | ✅ Badge bleu | ❌ → / | ❌ |
| **Admin** | ✅ | ✅ | ✅ Badge violet | ✅ | ✅ |

## ✅ CHECKLIST FINALE

### Configuration
- [ ] Compte admin créé dans Supabase Auth
- [ ] Profil admin avec role='admin' dans table profiles
- [ ] Vérification SQL du profil réussie

### Tests connexion
- [ ] Connexion admin fonctionne
- [ ] Connexion utilisateur standard fonctionne
- [ ] Déconnexion fonctionne

### Tests dashboards
- [ ] Dashboard admin accessible pour admin
- [ ] Dashboard admin affiche 6 statistiques
- [ ] Dashboard standard accessible pour tous
- [ ] Badges de rôle corrects (Administrateur vs Visiteur)

### Tests protection
- [ ] /admin bloqué pour non-admin
- [ ] /mon-compte bloqué pour non-connecté
- [ ] Bouton "Admin" visible uniquement pour admin

### Tests header
- [ ] Nom utilisateur affiché après connexion
- [ ] Bouton "Admin" visible pour admin uniquement
- [ ] Déconnexion fonctionne

### Tests console
- [ ] Pas d'erreurs JavaScript
- [ ] Pas d'erreurs Supabase (Invalid API key, etc.)
- [ ] Requêtes aboutissent correctement

## 🐛 Troubleshooting

### Problème : "relation profiles does not exist"
**Solution** : Exécuter la migration `20260706000001_create_profiles.sql`

### Problème : Stats admin = 0
**Solution** : Normal si base vide. Créer données de test (voir Phase 3)

### Problème : Bouton "Admin" pas visible
**Cause** : Le rôle n'est pas 'admin' dans la table profiles
**Solution** : Exécuter `UPDATE profiles SET role='admin' WHERE email='contact@andoh-dohgad.com'`

### Problème : Erreur "Invalid API key"
**Solution** : Vérifier `.env.local` contient la vraie clé (pas PLACEHOLDER)

### Problème : Redirection infinie
**Cause** : AuthContext ne charge pas le profil correctement
**Solution** : Vérifier la console pour voir l'erreur, vérifier table profiles existe

## 📸 Captures d'écran attendues

1. **Header non connecté** : Boutons "Connexion" + "Inscription"
2. **Header admin** : "Admin" + "Mon compte" + "Admin" (bouton violet) + déconnexion
3. **Header standard** : "Test" + "Mon compte" + déconnexion (PAS de "Admin")
4. **Dashboard admin** : 6 cartes stats + actions rapides
5. **Dashboard standard** : Profil + badge "Visiteur" + actions limitées

---

**Date** : 6 juillet 2026  
**Status** : Prêt pour tests complets
