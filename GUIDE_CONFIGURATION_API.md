# 🔐 GUIDE DE CONFIGURATION DES CLÉS API

**Date** : 14 juillet 2026  
**Fichier** : `.env.local`  
**Statut** : Configuration requise

---

## 📋 APERÇU

Ce guide vous accompagne pas à pas pour configurer toutes les clés API nécessaires au bon fonctionnement du projet.

---

## 🎯 PRIORITÉS DE CONFIGURATION

### ✅ Essentielles (à configurer immédiatement)
1. **Supabase** - Base de données et authentification
2. **EmailJS** - Formulaires de contact

### ⚠️ Importantes (pour les fonctionnalités complètes)
3. **Stripe** - Paiements par carte bancaire
4. **reCAPTCHA** - Protection anti-spam

### 📦 Optionnelles (fonctionnalités avancées)
5. **Orange Money** - Paiements mobile (Côte d'Ivoire)
6. **MTN Mobile Money** - Paiements mobile (Côte d'Ivoire)

---

## 🔧 1. SUPABASE (ESSENTIEL)

### Pourquoi ?
- Authentification des utilisateurs
- Base de données (13 tables)
- Stockage de fichiers (images)
- Backend complet

### Comment obtenir les clés ?

#### Étape 1 : Créer/Accéder au projet Supabase
```
1. Aller sur https://supabase.com
2. Connectez-vous ou créez un compte
3. Le projet existe déjà : tszsvbzfufglvdcsjzpo
   OU créez un nouveau projet si nécessaire
```

#### Étape 2 : Récupérer les clés
```
1. Dans le dashboard Supabase, cliquez sur votre projet
2. Allez dans Settings (⚙️) → API
3. Vous verrez :
   - Project URL (déjà configuré)
   - anon public (clé publique) ← À COPIER
   - service_role (clé secrète) ← À COPIER
```

#### Étape 3 : Configuration dans .env.local
```env
# Remplacez ces lignes :
VITE_SUPABASE_URL=https://tszsvbzfufglvdcsjzpo.supabase.co  # ✓ Déjà OK
VITE_SUPABASE_ANON_KEY=eyJ...VOTRE_VRAIE_CLE_ICI  # ← REMPLACER
SUPABASE_SERVICE_ROLE_KEY=eyJ...VOTRE_SERVICE_ROLE_KEY  # ← REMPLACER
```

#### ⚠️ IMPORTANT
- La `ANON_KEY` actuelle contient "PLACEHOLDER" → elle ne fonctionne pas
- Vous devez la remplacer par la vraie clé depuis le dashboard Supabase

#### Vérification
```bash
# Tester la connexion Supabase
curl https://tszsvbzfufglvdcsjzpo.supabase.co/rest/v1/ \
  -H "apikey: VOTRE_ANON_KEY" \
  -H "Authorization: Bearer VOTRE_ANON_KEY"

# Devrait retourner un JSON avec les tables disponibles
```

---

## 📧 2. EMAILJS (ESSENTIEL)

### Pourquoi ?
- Envoi d'emails depuis les formulaires
- Contact, rendez-vous, demandes de renseignements

### Comment obtenir les clés ?

#### Étape 1 : Créer un compte EmailJS
```
1. Aller sur https://www.emailjs.com
2. Créer un compte gratuit (300 emails/mois)
3. Confirmer votre email
```

#### Étape 2 : Créer un service email
```
1. Dans le dashboard, cliquez sur "Email Services"
2. Cliquez "Add New Service"
3. Choisissez votre provider (Gmail, Outlook, etc.)
4. Connectez votre compte email
5. Notez le SERVICE_ID (ex: service_xyz123)
```

#### Étape 3 : Créer un template
```
1. Cliquez sur "Email Templates"
2. Cliquez "Create New Template"
3. Template par défaut :
   
   Subject: Nouveau message de {{from_name}}
   
   Message:
   {{message}}
   
   De: {{from_email}}

4. Enregistrez et notez le TEMPLATE_ID (ex: template_abc456)
```

#### Étape 4 : Récupérer la clé publique
```
1. Allez dans "Account" → "API Keys"
2. Copiez votre "Public Key" (ex: user_def789)
```

#### Étape 5 : Configuration dans .env.local
```env
VITE_EMAILJS_SERVICE_ID=service_xyz123      # ← REMPLACER
VITE_EMAILJS_TEMPLATE_ID=template_abc456    # ← REMPLACER
VITE_EMAILJS_PUBLIC_KEY=user_def789         # ← REMPLACER
```

#### Vérification
```javascript
// Tester dans la console du navigateur
import emailjs from 'emailjs-com';

emailjs.send(
  'service_xyz123',
  'template_abc456',
  {
    from_name: 'Test',
    from_email: 'test@example.com',
    message: 'Test message'
  },
  'user_def789'
)
.then(response => console.log('SUCCESS!', response))
.catch(error => console.log('FAILED...', error));
```

---

## 💳 3. STRIPE (IMPORTANT)

### Pourquoi ?
- Paiements par carte bancaire
- Achat de documentation
- Abonnements co-working

### Comment obtenir les clés ?

#### Étape 1 : Créer un compte Stripe
```
1. Aller sur https://stripe.com
2. Créer un compte (gratuit)
3. Activer le mode Test
```

#### Étape 2 : Récupérer les clés de test
```
1. Dans le dashboard, cliquez sur "Developers" → "API keys"
2. Mode : Test (basculer en haut à droite)
3. Vous verrez :
   - Publishable key (pk_test_...) ← Clé publique
   - Secret key (sk_test_...) ← Clé secrète (cliquez "Reveal")
```

#### Étape 3 : Configuration dans .env.local
```env
VITE_STRIPE_PUBLIC_KEY=pk_test_VOTRE_CLE_PUBLIQUE  # ← REMPLACER
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE        # ← REMPLACER
```

#### ⚠️ Mode Test vs Production
```
Mode Test :
- pk_test_... (publique)
- sk_test_... (secrète)
- Aucun argent réel
- Cartes de test : 4242 4242 4242 4242

Mode Production (quand prêt) :
- pk_live_... (publique)
- sk_live_... (secrète)
- Argent réel
- Activation du compte requise
```

#### Vérification
```bash
# Tester avec curl
curl https://api.stripe.com/v1/customers \
  -u sk_test_VOTRE_CLE_SECRETE:

# Devrait retourner une liste de clients (vide au début)
```

---

## 🤖 4. reCAPTCHA (IMPORTANT)

### Pourquoi ?
- Protection anti-spam
- Sécurité des formulaires

### Comment obtenir les clés ?

#### Étape 1 : Accéder à Google reCAPTCHA
```
1. Aller sur https://www.google.com/recaptcha/admin
2. Connectez-vous avec votre compte Google
```

#### Étape 2 : Créer un site
```
1. Cliquez sur "+" pour ajouter un site
2. Label : "Andoh & Dohgad Consulting"
3. Type : reCAPTCHA v2 (case à cocher)
4. Domaines :
   - localhost (pour le dev)
   - votre-domaine.com (pour la prod)
5. Cliquez "Submit"
```

#### Étape 3 : Récupérer les clés
```
Vous recevrez :
- Site Key (clé publique) ← Pour le frontend
- Secret Key (clé secrète) ← Pour le backend
```

#### Étape 4 : Configuration dans .env.local
```env
VITE_RECAPTCHA_SITE_KEY=6Lc...VOTRE_SITE_KEY     # ← REMPLACER
RECAPTCHA_SECRET_KEY=6Lc...VOTRE_SECRET_KEY      # ← REMPLACER
```

---

## 📱 5. ORANGE MONEY (OPTIONNEL)

### Pourquoi ?
- Paiements mobile en Côte d'Ivoire
- Alternative aux cartes bancaires

### Comment obtenir les clés ?

#### Étape 1 : Inscription Orange Developer
```
1. Aller sur https://developer.orange.com
2. Créer un compte développeur
3. Vérifier votre identité (peut prendre quelques jours)
```

#### Étape 2 : Créer une application
```
1. Dans le dashboard, créer une application
2. Souscrire à l'API "Orange Money"
3. Choisir le plan (Sandbox pour tests)
```

#### Étape 3 : Récupérer les clés
```
Vous recevrez :
- Consumer Key (Merchant Key)
- Consumer Secret (API Key)
```

#### Étape 4 : Configuration dans .env.local
```env
ORANGE_MONEY_MERCHANT_KEY=VOTRE_CONSUMER_KEY    # ← REMPLACER
ORANGE_MONEY_API_KEY=VOTRE_CONSUMER_SECRET      # ← REMPLACER
```

---

## 📱 6. MTN MOBILE MONEY (OPTIONNEL)

### Pourquoi ?
- Paiements mobile MTN en Côte d'Ivoire
- Alternative aux cartes bancaires

### Comment obtenir les clés ?

#### Étape 1 : Inscription MTN MoMo Developer
```
1. Aller sur https://momodeveloper.mtn.com
2. Créer un compte développeur
3. Vérifier votre email
```

#### Étape 2 : S'abonner à l'API
```
1. Dans le dashboard, aller dans "Products"
2. Souscrire à "Collection" (paiements entrants)
3. Mode : Sandbox
```

#### Étape 3 : Créer un API User
```
1. Dans la console API, exécuter :
   POST /v1_0/apiuser
   
2. Créer une API Key :
   POST /v1_0/apiuser/{userId}/apikey
```

#### Étape 4 : Configuration dans .env.local
```env
MTN_MOMO_SUBSCRIPTION_KEY=VOTRE_SUBSCRIPTION_KEY  # ← REMPLACER
MTN_MOMO_API_USER=VOTRE_API_USER_ID               # ← REMPLACER
MTN_MOMO_API_KEY=VOTRE_API_KEY                    # ← REMPLACER
```

---

## 🔄 MISE À JOUR DU FICHIER .env.local

### Ouvrir le fichier
```bash
nano /home/serge/Téléchargements/dohgahnew/.env.local
# ou
code /home/serge/Téléchargements/dohgahnew/.env.local
```

### Remplacer les placeholders
```env
# AVANT
VITE_SUPABASE_ANON_KEY=eyJ...PLACEHOLDER

# APRÈS
VITE_SUPABASE_ANON_KEY=eyJ...VOTRE_VRAIE_CLE_COMPLETE
```

### Sauvegarder
```
Ctrl + O (nano)
Ctrl + X (nano)

Ctrl + S (VS Code)
```

---

## ✅ VÉRIFICATION POST-CONFIGURATION

### 1. Vérifier la syntaxe
```bash
# Les variables doivent être sans guillemets (sauf si espaces)
cat .env.local | grep "^VITE_"

# Affichera :
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_EMAILJS_SERVICE_ID=service_...
```

### 2. Redémarrer le serveur
```bash
# Arrêter le serveur actuel
lsof -ti:3001 | xargs kill -9

# Redémarrer
npm run dev
```

### 3. Tester dans le navigateur
```
1. Ouvrir http://localhost:3001
2. Ouvrir la Console (F12)
3. Taper :
   console.log(import.meta.env.VITE_SUPABASE_URL)
   
4. Devrait afficher l'URL Supabase
```

### 4. Tester les fonctionnalités

#### Supabase
```
1. Aller sur /connexion
2. Essayer de se connecter
3. Si erreur "Invalid API key" → Clé incorrecte
4. Si succès → Clé correcte ✓
```

#### EmailJS
```
1. Aller sur /contact
2. Remplir le formulaire
3. Envoyer
4. Vérifier votre boîte email
```

#### Stripe (mode test)
```
1. Aller sur /documentation
2. Essayer d'acheter un document
3. Utiliser la carte de test : 4242 4242 4242 4242
4. Date : n'importe quelle date future
5. CVC : n'importe quel 3 chiffres
```

---

## 🔐 SÉCURITÉ

### ✅ À FAIRE
- ✅ Ne jamais committer .env.local dans Git
- ✅ Vérifier que .env.local est dans .gitignore
- ✅ Utiliser des clés de test en développement
- ✅ Utiliser des clés de production uniquement en prod
- ✅ Restreindre les domaines autorisés

### ❌ À NE PAS FAIRE
- ❌ Partager vos clés API publiquement
- ❌ Committer .env.local dans Git
- ❌ Utiliser des clés de production en développement
- ❌ Hardcoder les clés dans le code source

### Vérifier le .gitignore
```bash
cat .gitignore | grep ".env"

# Devrait afficher :
.env
.env.local
.env.*.local
```

---

## 📊 CHECKLIST DE CONFIGURATION

### Essentielles
- [ ] Supabase ANON_KEY configurée
- [ ] Supabase SERVICE_ROLE_KEY configurée
- [ ] EmailJS SERVICE_ID configuré
- [ ] EmailJS TEMPLATE_ID configuré
- [ ] EmailJS PUBLIC_KEY configuré

### Importantes
- [ ] Stripe PUBLIC_KEY configurée
- [ ] Stripe SECRET_KEY configurée
- [ ] reCAPTCHA SITE_KEY configurée
- [ ] reCAPTCHA SECRET_KEY configurée

### Optionnelles
- [ ] Orange Money MERCHANT_KEY configurée
- [ ] Orange Money API_KEY configurée
- [ ] MTN MoMo SUBSCRIPTION_KEY configurée
- [ ] MTN MoMo API_USER configuré
- [ ] MTN MoMo API_KEY configurée

### Vérifications
- [ ] Fichier .env.local sauvegardé
- [ ] Serveur redémarré
- [ ] Connexion Supabase testée
- [ ] Formulaire EmailJS testé
- [ ] Paiement Stripe testé (mode test)

---

## 🆘 PROBLÈMES COURANTS

### Erreur : "Invalid API key"
```
Cause : Clé Supabase incorrecte ou incomplète
Solution : Vérifier que la clé est complète et sans espaces
```

### Erreur : "CORS policy"
```
Cause : Domaine non autorisé
Solution : Ajouter localhost dans les domaines autorisés (Supabase, Stripe)
```

### Variables non chargées
```
Cause : Serveur non redémarré après modification .env.local
Solution : Redémarrer npm run dev
```

### EmailJS ne fonctionne pas
```
Cause : Template ID ou Service ID incorrect
Solution : Vérifier les IDs dans le dashboard EmailJS
```

---

## 📞 RESSOURCES

### Documentations officielles
- Supabase : https://supabase.com/docs
- EmailJS : https://www.emailjs.com/docs
- Stripe : https://stripe.com/docs
- reCAPTCHA : https://developers.google.com/recaptcha
- Orange Money : https://developer.orange.com
- MTN MoMo : https://momodeveloper.mtn.com/api-documentation

### Support
- Supabase Discord : https://discord.supabase.com
- Stripe Support : https://support.stripe.com
- EmailJS Support : support@emailjs.com

---

**Version** : 1.0  
**Dernière mise à jour** : 14 juillet 2026  
**Auteur** : Claude Code