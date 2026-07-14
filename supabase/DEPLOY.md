# 🚀 GUIDE DE DÉPLOIEMENT SUPABASE

## ÉTAPE 1 : Connexion à votre base de données

### Via Supabase Dashboard (Recommandé)

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez le projet **tszsvbzfufglvdcsjzpo**
3. Menu "SQL Editor"

### Via psql (Ligne de commande)

```bash
# Connexion directe
PGPASSWORD="Proud@#2026-" psql \
  -h db.tszsvbzfufglvdcsjzpo.supabase.co \
  -U postgres \
  -d postgres \
  -p 5432

# Ou connexion transaction pooler
PGPASSWORD="Proud@#2026-" psql \
  postgresql://postgres.tszsvbzfufglvdcsjzpo:Proud@#2026-@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

---

## ÉTAPE 2 : Exécution des migrations (DANS L'ORDRE !)

### Méthode 1 : Copier-coller dans SQL Editor

Ouvrez chaque fichier de migration et copiez-collez le contenu dans SQL Editor, puis exécutez :

1. `migrations/20260706000001_create_profiles.sql`
2. `migrations/20260706000002_create_services.sql`
3. `migrations/20260706000003_create_blog.sql`
4. `migrations/20260706000004_create_documentation.sql`
5. `migrations/20260706000005_create_appointments.sql`
6. `migrations/20260706000006_create_coworking.sql`
7. `migrations/20260706000007_create_surveys.sql`
8. `migrations/20260706000008_create_contact_solutions.sql`
9. `migrations/20260706000009_create_audit_logs.sql`
10. `migrations/20260706000010_create_storage_buckets.sql`

### Méthode 2 : Script automatique (psql)

```bash
# Depuis le dossier racine du projet
cd supabase/migrations

PGPASSWORD="Proud@#2026-" psql \
  -h db.tszsvbzfufglvdcsjzpo.supabase.co \
  -U postgres \
  -d postgres \
  -p 5432 \
  -f 20260706000001_create_profiles.sql \
  -f 20260706000002_create_services.sql \
  -f 20260706000003_create_blog.sql \
  -f 20260706000004_create_documentation.sql \
  -f 20260706000005_create_appointments.sql \
  -f 20260706000006_create_coworking.sql \
  -f 20260706000007_create_surveys.sql \
  -f 20260706000008_create_contact_solutions.sql \
  -f 20260706000009_create_audit_logs.sql \
  -f 20260706000010_create_storage_buckets.sql
```

---

## ÉTAPE 3 : Vérification des migrations

Dans SQL Editor, exécutez :

```sql
-- Vérifier les tables créées
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Devrait afficher :
-- appointments
-- audit_logs
-- blog_post_translations
-- blog_posts
-- contact_messages
-- coworking_bookings
-- coworking_spaces
-- coworking_subscriptions
-- documentation
-- documentation_purchases
-- documentation_translations
-- profiles
-- service_translations
-- services
-- solution_translations
-- solutions
-- surveys

-- Vérifier les enums créés
SELECT typname
FROM pg_type
WHERE typtype = 'e'
ORDER BY typname;

-- Devrait afficher :
-- appointment_status
-- blog_category
-- booking_status
-- content_status
-- document_type
-- message_status
-- payment_method
-- payment_status
-- space_status
-- space_type
-- subscription_plan
-- subscription_status
-- survey_status
-- survey_type
-- time_slot
-- user_role

-- Vérifier les fonctions créées
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;
```

---

## ÉTAPE 4 : Seed des données initiales

### 4.1 Créer le compte admin

**IMPORTANT** : Avant d'exécuter le seed, créez d'abord l'utilisateur admin via Dashboard :

1. Menu **Authentication** > **Users**
2. Cliquez "Add user" > "Create new user"
3. Remplissez :
   - Email: `contact@andoh-dohgad.com`
   - Password: `[CHOISIR UN MOT DE PASSE FORT]`
   - Cochez "Auto Confirm User"
4. Cliquez "Create user"

Le trigger PostgreSQL créera automatiquement le profil avec `role='admin'`.

### 4.2 Seed services

Dans SQL Editor, exécutez :

```sql
-- Copier-coller le contenu de seed/seed_services.sql
```

---

## ÉTAPE 5 : Configuration Storage

Les buckets sont créés automatiquement par la migration `20260706000010_create_storage_buckets.sql`.

Vérifiez dans **Storage** :
- `documentation` (privé)
- `blog-images` (public)
- `service-images` (public)
- `avatars` (public)
- `coworking-images` (public)

---

## ÉTAPE 6 : Récupération des clés API

### 6.1 Clés Supabase

Menu **Settings** > **API** :

1. **Project URL** : https://tszsvbzfufglvdcsjzpo.supabase.co
2. **anon public** : Copier dans `VITE_SUPABASE_ANON_KEY`
3. **service_role** : Copier dans `SUPABASE_SERVICE_ROLE_KEY` (⚠️ NE JAMAIS exposer côté client)

### 6.2 Clés Stripe

1. Allez sur https://dashboard.stripe.com/
2. Mode Test activé
3. **Developers** > **API keys**
4. Copier :
   - **Publishable key** → `VITE_STRIPE_PUBLIC_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

### 6.3 Orange Money

1. Créer un compte marchand : https://developer.orange.com/
2. Souscrire à l'API "Orange Money WebPay"
3. Récupérer :
   - **Merchant Key** → `ORANGE_MONEY_MERCHANT_KEY`
   - **API Key** → `ORANGE_MONEY_API_KEY`

### 6.4 MTN Mobile Money

1. Créer un compte : https://momodeveloper.mtn.com/
2. Souscrire à "Collection" API
3. Générer :
   - **Primary Subscription Key** → `MTN_MOMO_SUBSCRIPTION_KEY`
   - **API User** → `MTN_MOMO_API_USER`
   - **API Key** → `MTN_MOMO_API_KEY`

---

## ÉTAPE 7 : Configuration .env.local

Copier toutes les clés dans `.env.local` :

```env
# Supabase
VITE_SUPABASE_URL=https://tszsvbzfufglvdcsjzpo.supabase.co
VITE_SUPABASE_ANON_KEY=[VOTRE_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[VOTRE_SERVICE_ROLE_KEY]
SUPABASE_DB_PASSWORD=Proud@#2026-

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_[VOTRE_KEY]
STRIPE_SECRET_KEY=sk_test_[VOTRE_KEY]

# Orange Money
ORANGE_MONEY_MERCHANT_KEY=[VOTRE_KEY]
ORANGE_MONEY_API_KEY=[VOTRE_KEY]

# MTN Mobile Money
MTN_MOMO_SUBSCRIPTION_KEY=[VOTRE_KEY]
MTN_MOMO_API_USER=[VOTRE_USER]
MTN_MOMO_API_KEY=[VOTRE_KEY]

# EmailJS (existant)
VITE_EMAILJS_SERVICE_ID=[VOTRE_ID]
VITE_EMAILJS_TEMPLATE_ID=[VOTRE_ID]
VITE_EMAILJS_PUBLIC_KEY=[VOTRE_KEY]
```

---

## ÉTAPE 8 : Test de connexion

### Test 1 : Connexion base de données

```bash
npm run dev
```

Ouvrir console navigateur, taper :

```javascript
import { supabase } from '@/lib/supabase/client';

// Test query
const { data, error } = await supabase
  .from('services')
  .select('*')
  .limit(1);

console.log('Data:', data);
console.log('Error:', error);
```

### Test 2 : Authentification admin

Aller sur `/auth/connexion` et se connecter avec :
- Email: `contact@andoh-dohgad.com`
- Password: [votre mot de passe]

Si succès → Redirection vers `/mon-compte`

### Test 3 : Vérifier le rôle

Console navigateur :

```javascript
import { useAuth } from '@/contexts/AuthContext';

const { profile } = useAuth();
console.log('Role:', profile?.role); // Devrait afficher "admin"
```

---

## ÉTAPE 9 : Seed espaces coworking (Optionnel)

Pour ajouter des espaces de coworking de test :

```sql
-- Bureau individuel
INSERT INTO coworking_spaces (name, type, capacity, amenities, hourly_rate, daily_rate, status)
VALUES
  ('Bureau 1A', 'individual_office', 1, ARRAY['wifi', 'climatisation', 'bureau_ergonomique'], 2000, 15000, 'available'),
  ('Bureau 2B', 'individual_office', 1, ARRAY['wifi', 'climatisation', 'armoire'], 2000, 15000, 'available');

-- Open space
INSERT INTO coworking_spaces (name, type, capacity, amenities, hourly_rate, daily_rate, status)
VALUES
  ('Open Space Principal', 'open_space', 20, ARRAY['wifi', 'climatisation', 'imprimante', 'cafeteria'], 1000, 8000, 'available');

-- Salles de réunion
INSERT INTO coworking_spaces (name, type, capacity, amenities, hourly_rate, daily_rate, status)
VALUES
  ('Salle de reunion A', 'meeting_room', 8, ARRAY['wifi', 'ecran_tv', 'visioconference', 'paperboard'], 5000, 30000, 'available'),
  ('Salle de reunion B', 'meeting_room', 12, ARRAY['wifi', 'projecteur', 'visioconference', 'paperboard'], 7000, 40000, 'available');
```

---

## ✅ CHECKLIST DE DÉPLOIEMENT

- [ ] Migrations exécutées (10 fichiers)
- [ ] Compte admin créé (`contact@andoh-dohgad.com`)
- [ ] Services seedés (6 services)
- [ ] Storage buckets créés (5 buckets)
- [ ] Clés Supabase récupérées
- [ ] Clés Stripe configurées
- [ ] Clés Orange Money configurées (si disponibles)
- [ ] Clés MTN MoMo configurées (si disponibles)
- [ ] `.env.local` rempli
- [ ] Test connexion DB réussi
- [ ] Test authentification admin réussi
- [ ] Espaces coworking seedés (optionnel)

---

## 🐛 TROUBLESHOOTING

### Erreur : "permission denied for table X"

**Cause** : RLS activé mais pas de policy pour l'opération  
**Solution** : Vérifier que l'utilisateur est authentifié et a le bon rôle

```sql
-- Vérifier les policies
SELECT * FROM pg_policies WHERE tablename = 'nom_de_la_table';
```

### Erreur : "relation X does not exist"

**Cause** : Migration non exécutée ou exécutée dans le mauvais ordre  
**Solution** : Réexécuter les migrations dans l'ordre

### Erreur : "duplicate key value violates unique constraint"

**Cause** : Tentative d'insertion de données déjà existantes  
**Solution** : Les seeds utilisent `ON CONFLICT DO NOTHING`, vérifier la requête

### Supabase client retourne null

**Cause** : Variables d'environnement manquantes  
**Solution** : Vérifier `.env.local` et redémarrer `npm run dev`

---

## 📞 SUPPORT

Si vous rencontrez des problèmes :

1. Vérifier les logs Supabase : Dashboard > **Logs** > **Postgres Logs**
2. Vérifier la console navigateur pour erreurs JS
3. Tester les queries directement dans SQL Editor
4. Consulter la documentation Supabase : https://supabase.com/docs

---

**Guide créé le** : 6 juillet 2026  
**Pour le projet** : Andoh & Dohgad Consulting  
**Base de données** : tszsvbzfufglvdcsjzpo
