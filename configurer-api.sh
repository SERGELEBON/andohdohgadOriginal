#!/bin/bash

# Script interactif de configuration des clés API
# Andoh & Dohgad Consulting

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

ENV_FILE=".env.local"

# Fonction pour afficher un titre
print_header() {
    echo -e "\n${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}  $1"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}\n"
}

# Fonction pour demander une confirmation
ask_yes_no() {
    while true; do
        read -p "$1 (o/n) " yn
        case $yn in
            [Oo]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Répondez par o (oui) ou n (non).";;
        esac
    done
}

# Fonction pour mettre à jour une variable
update_env_var() {
    local var_name=$1
    local var_value=$2

    if grep -q "^${var_name}=" "$ENV_FILE"; then
        # Variable existe, la mettre à jour
        sed -i "s|^${var_name}=.*|${var_name}=${var_value}|" "$ENV_FILE"
    else
        # Variable n'existe pas, l'ajouter
        echo "${var_name}=${var_value}" >> "$ENV_FILE"
    fi
}

# Banner
clear
echo -e "${PURPLE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     🔐 CONFIGURATION DES CLÉS API                             ║
║     Andoh & Dohgad Consulting                                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Vérifier que .env.local existe
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Erreur : $ENV_FILE n'existe pas${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Fichier $ENV_FILE trouvé${NC}\n"

# ============================================
# 1. SUPABASE
# ============================================
print_header "1️⃣  SUPABASE (ESSENTIEL)"

echo -e "${CYAN}Supabase est votre base de données et système d'authentification.${NC}"
echo -e "URL du projet : ${GREEN}https://tszsvbzfufglvdcsjzpo.supabase.co${NC}"
echo ""
echo "Pour obtenir vos clés :"
echo "  1. Allez sur https://supabase.com"
echo "  2. Ouvrez votre projet"
echo "  3. Settings → API"
echo ""

if ask_yes_no "Voulez-vous configurer Supabase maintenant ?"; then
    echo ""
    read -p "Entrez votre ANON KEY (clé publique) : " supabase_anon_key

    if [ ! -z "$supabase_anon_key" ]; then
        update_env_var "VITE_SUPABASE_ANON_KEY" "$supabase_anon_key"
        echo -e "${GREEN}✓ ANON KEY configurée${NC}"
    fi

    echo ""
    read -p "Entrez votre SERVICE_ROLE_KEY (clé privée) : " supabase_service_key

    if [ ! -z "$supabase_service_key" ]; then
        update_env_var "SUPABASE_SERVICE_ROLE_KEY" "$supabase_service_key"
        echo -e "${GREEN}✓ SERVICE_ROLE_KEY configurée${NC}"
    fi
else
    echo -e "${YELLOW}⏭  Supabase ignoré${NC}"
fi

# ============================================
# 2. EMAILJS
# ============================================
print_header "2️⃣  EMAILJS (ESSENTIEL)"

echo -e "${CYAN}EmailJS permet d'envoyer des emails depuis vos formulaires.${NC}"
echo ""
echo "Pour obtenir vos clés :"
echo "  1. Allez sur https://www.emailjs.com"
echo "  2. Créez un compte (gratuit : 300 emails/mois)"
echo "  3. Créez un service email et un template"
echo ""

if ask_yes_no "Voulez-vous configurer EmailJS maintenant ?"; then
    echo ""
    read -p "Entrez votre SERVICE_ID : " emailjs_service_id

    if [ ! -z "$emailjs_service_id" ]; then
        update_env_var "VITE_EMAILJS_SERVICE_ID" "$emailjs_service_id"
        echo -e "${GREEN}✓ SERVICE_ID configuré${NC}"
    fi

    echo ""
    read -p "Entrez votre TEMPLATE_ID : " emailjs_template_id

    if [ ! -z "$emailjs_template_id" ]; then
        update_env_var "VITE_EMAILJS_TEMPLATE_ID" "$emailjs_template_id"
        echo -e "${GREEN}✓ TEMPLATE_ID configuré${NC}"
    fi

    echo ""
    read -p "Entrez votre PUBLIC_KEY : " emailjs_public_key

    if [ ! -z "$emailjs_public_key" ]; then
        update_env_var "VITE_EMAILJS_PUBLIC_KEY" "$emailjs_public_key"
        echo -e "${GREEN}✓ PUBLIC_KEY configurée${NC}"
    fi
else
    echo -e "${YELLOW}⏭  EmailJS ignoré${NC}"
fi

# ============================================
# 3. STRIPE
# ============================================
print_header "3️⃣  STRIPE (IMPORTANT)"

echo -e "${CYAN}Stripe gère les paiements par carte bancaire.${NC}"
echo ""
echo "Pour obtenir vos clés :"
echo "  1. Allez sur https://stripe.com"
echo "  2. Developers → API keys"
echo "  3. Basculez en mode Test"
echo ""

if ask_yes_no "Voulez-vous configurer Stripe maintenant ?"; then
    echo ""
    read -p "Entrez votre PUBLISHABLE KEY (pk_test_...) : " stripe_public_key

    if [ ! -z "$stripe_public_key" ]; then
        update_env_var "VITE_STRIPE_PUBLIC_KEY" "$stripe_public_key"
        echo -e "${GREEN}✓ PUBLISHABLE KEY configurée${NC}"
    fi

    echo ""
    read -p "Entrez votre SECRET KEY (sk_test_...) : " stripe_secret_key

    if [ ! -z "$stripe_secret_key" ]; then
        update_env_var "STRIPE_SECRET_KEY" "$stripe_secret_key"
        echo -e "${GREEN}✓ SECRET KEY configurée${NC}"
    fi
else
    echo -e "${YELLOW}⏭  Stripe ignoré${NC}"
fi

# ============================================
# 4. reCAPTCHA
# ============================================
print_header "4️⃣  reCAPTCHA (IMPORTANT)"

echo -e "${CYAN}reCAPTCHA protège vos formulaires contre le spam.${NC}"
echo ""
echo "Pour obtenir vos clés :"
echo "  1. Allez sur https://www.google.com/recaptcha/admin"
echo "  2. Créez un site avec reCAPTCHA v2"
echo "  3. Ajoutez localhost dans les domaines"
echo ""

if ask_yes_no "Voulez-vous configurer reCAPTCHA maintenant ?"; then
    echo ""
    read -p "Entrez votre SITE KEY : " recaptcha_site_key

    if [ ! -z "$recaptcha_site_key" ]; then
        update_env_var "VITE_RECAPTCHA_SITE_KEY" "$recaptcha_site_key"
        echo -e "${GREEN}✓ SITE KEY configurée${NC}"
    fi

    echo ""
    read -p "Entrez votre SECRET KEY : " recaptcha_secret_key

    if [ ! -z "$recaptcha_secret_key" ]; then
        update_env_var "RECAPTCHA_SECRET_KEY" "$recaptcha_secret_key"
        echo -e "${GREEN}✓ SECRET KEY configurée${NC}"
    fi
else
    echo -e "${YELLOW}⏭  reCAPTCHA ignoré${NC}"
fi

# ============================================
# 5. MOBILE MONEY (OPTIONNEL)
# ============================================
print_header "5️⃣  MOBILE MONEY (OPTIONNEL)"

echo -e "${CYAN}Orange Money et MTN Mobile Money pour les paiements mobiles.${NC}"
echo ""

if ask_yes_no "Voulez-vous configurer Mobile Money maintenant ?"; then

    # Orange Money
    echo ""
    echo -e "${YELLOW}--- Orange Money ---${NC}"
    read -p "Merchant Key : " orange_merchant_key

    if [ ! -z "$orange_merchant_key" ]; then
        update_env_var "ORANGE_MONEY_MERCHANT_KEY" "$orange_merchant_key"
        echo -e "${GREEN}✓ Orange Merchant Key configurée${NC}"
    fi

    read -p "API Key : " orange_api_key

    if [ ! -z "$orange_api_key" ]; then
        update_env_var "ORANGE_MONEY_API_KEY" "$orange_api_key"
        echo -e "${GREEN}✓ Orange API Key configurée${NC}"
    fi

    # MTN Mobile Money
    echo ""
    echo -e "${YELLOW}--- MTN Mobile Money ---${NC}"
    read -p "Subscription Key : " mtn_subscription_key

    if [ ! -z "$mtn_subscription_key" ]; then
        update_env_var "MTN_MOMO_SUBSCRIPTION_KEY" "$mtn_subscription_key"
        echo -e "${GREEN}✓ MTN Subscription Key configurée${NC}"
    fi

    read -p "API User : " mtn_api_user

    if [ ! -z "$mtn_api_user" ]; then
        update_env_var "MTN_MOMO_API_USER" "$mtn_api_user"
        echo -e "${GREEN}✓ MTN API User configuré${NC}"
    fi

    read -p "API Key : " mtn_api_key

    if [ ! -z "$mtn_api_key" ]; then
        update_env_var "MTN_MOMO_API_KEY" "$mtn_api_key"
        echo -e "${GREEN}✓ MTN API Key configurée${NC}"
    fi
else
    echo -e "${YELLOW}⏭  Mobile Money ignoré${NC}"
fi

# ============================================
# RÉSUMÉ
# ============================================
print_header "✅ CONFIGURATION TERMINÉE"

echo -e "${GREEN}Vos clés API ont été enregistrées dans $ENV_FILE${NC}\n"

echo "Prochaines étapes :"
echo ""
echo "  1️⃣  Redémarrer le serveur de développement :"
echo "     ${CYAN}npm run dev${NC}"
echo ""
echo "  2️⃣  Tester les fonctionnalités :"
echo "     - Connexion Supabase : http://localhost:3001/connexion"
echo "     - Formulaire EmailJS : http://localhost:3001/contact"
echo "     - Paiement Stripe : http://localhost:3001/documentation"
echo ""
echo "  3️⃣  Consulter la documentation complète :"
echo "     ${CYAN}cat GUIDE_CONFIGURATION_API.md${NC}"
echo ""

if ask_yes_no "Voulez-vous redémarrer le serveur maintenant ?"; then
    echo ""
    echo -e "${BLUE}Arrêt du serveur actuel...${NC}"
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    sleep 2

    echo -e "${BLUE}Démarrage du serveur...${NC}"
    npm run dev &

    sleep 3
    echo ""
    echo -e "${GREEN}✓ Serveur démarré${NC}"
    echo -e "Accédez au site : ${CYAN}http://localhost:3001${NC}"
else
    echo ""
    echo -e "${YELLOW}N'oubliez pas de redémarrer le serveur manuellement :${NC}"
    echo -e "${CYAN}npm run dev${NC}"
fi

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${PURPLE}  Configuration terminée avec succès ! 🎉${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════${NC}"
echo ""