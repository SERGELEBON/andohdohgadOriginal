#!/bin/bash

# Script de réparation automatique du projet Andoh & Dohgad
# Date: 14 juillet 2026
# Objectif: Restaurer et fusionner la structure du projet

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction de log
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier qu'on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    log_error "package.json introuvable. Êtes-vous dans le bon répertoire?"
    exit 1
fi

log_info "=========================================="
log_info "RÉPARATION DU PROJET ANDOH & DOHGAD"
log_info "=========================================="
echo ""

# Phase 1: Créer la structure src/
log_info "Phase 1: Restauration de la structure src/"
echo ""

if [ -d "src" ]; then
    log_warning "Le dossier src/ existe déjà. Sauvegarde en src.backup..."
    mv src src.backup.$(date +%Y%m%d_%H%M%S)
fi

log_info "Création du dossier src/..."
mkdir -p src

# Copier le contenu de webandoh vers src
if [ -d "webandoh" ]; then
    log_info "Copie du frontend depuis webandoh/..."
    cp -r webandoh/* src/
    log_success "Contenu de webandoh copié dans src/"
else
    log_error "Le dossier webandoh/ n'existe pas!"
    exit 1
fi

# Phase 2: Intégration du backend
log_info ""
log_info "Phase 2: Intégration des composants backend"
echo ""

if [ -d "new_andoh-dohgad" ]; then

    # Copier la configuration Supabase
    log_info "Copie de la configuration Supabase..."
    mkdir -p src/lib/supabase
    if [ -d "new_andoh-dohgad/src/lib/supabase" ]; then
        cp -r new_andoh-dohgad/src/lib/supabase/* src/lib/supabase/
        log_success "Configuration Supabase copiée"
    else
        log_warning "Configuration Supabase non trouvée dans new_andoh-dohgad"
    fi

    # Copier la configuration Stripe
    log_info "Copie de la configuration Stripe..."
    mkdir -p src/lib/stripe
    if [ -d "new_andoh-dohgad/src/lib/stripe" ]; then
        cp -r new_andoh-dohgad/src/lib/stripe/* src/lib/stripe/
        log_success "Configuration Stripe copiée"
    else
        log_warning "Configuration Stripe non trouvée"
    fi

    # Copier la configuration Mobile Money
    log_info "Copie de la configuration Mobile Money..."
    mkdir -p src/lib/mobile-money
    if [ -d "new_andoh-dohgad/src/lib/mobile-money" ]; then
        cp -r new_andoh-dohgad/src/lib/mobile-money/* src/lib/mobile-money/
        log_success "Configuration Mobile Money copiée"
    else
        log_warning "Configuration Mobile Money non trouvée"
    fi

    # Copier les composants admin
    log_info "Copie des composants admin..."
    if [ -d "new_andoh-dohgad/src/components/admin" ]; then
        mkdir -p src/components/admin
        cp -r new_andoh-dohgad/src/components/admin/* src/components/admin/
        log_success "Composants admin copiés"
    fi

    # Copier les composants auth
    log_info "Copie des composants d'authentification..."
    if [ -d "new_andoh-dohgad/src/components/auth" ]; then
        mkdir -p src/components/auth
        cp -r new_andoh-dohgad/src/components/auth/* src/components/auth/
        log_success "Composants auth copiés"
    fi

    # Copier les contextes
    log_info "Copie des contextes React..."
    if [ -d "new_andoh-dohgad/src/contexts" ]; then
        cp -r new_andoh-dohgad/src/contexts/* src/contexts/ 2>/dev/null || mkdir -p src/contexts && cp -r new_andoh-dohgad/src/contexts/* src/contexts/
        log_success "Contextes copiés"
    fi

    # Copier les pages admin
    log_info "Copie des pages admin..."
    if [ -d "new_andoh-dohgad/src/pages" ]; then
        mkdir -p src/pages/admin
        # Copier uniquement les pages admin pour éviter d'écraser les pages publiques
        for page in new_andoh-dohgad/src/pages/*Dashboard.tsx new_andoh-dohgad/src/pages/*Admin*.tsx; do
            if [ -f "$page" ]; then
                cp "$page" src/pages/admin/
            fi
        done
        log_success "Pages admin copiées"
    fi

    # Copier les migrations Supabase
    log_info "Copie des migrations Supabase..."
    if [ -d "new_andoh-dohgad/supabase" ]; then
        cp -r new_andoh-dohgad/supabase .
        log_success "Migrations Supabase copiées"
    fi

else
    log_error "Le dossier new_andoh-dohgad/ n'existe pas!"
    exit 1
fi

# Phase 3: Configuration
log_info ""
log_info "Phase 3: Configuration de l'environnement"
echo ""

# Créer .env.local
if [ ! -f ".env.local" ]; then
    log_info "Création du fichier .env.local..."
    if [ -f "new_andoh-dohgad/.env.local" ]; then
        cp new_andoh-dohgad/.env.local .env.local
        log_success ".env.local créé depuis new_andoh-dohgad"
    elif [ -f ".env.example" ]; then
        cp .env.example .env.local
        log_success ".env.local créé depuis .env.example"
        log_warning "⚠️  IMPORTANT: Configurez les vraies clés API dans .env.local"
    else
        log_warning ".env.local non créé - aucun fichier source trouvé"
    fi
else
    log_warning ".env.local existe déjà (non écrasé)"
fi

# Phase 4: Installation des dépendances
log_info ""
log_info "Phase 4: Installation des dépendances"
echo ""

log_info "Installation des dépendances npm..."
npm install

log_success "Dépendances installées"

# Phase 5: Vérification
log_info ""
log_info "Phase 5: Vérification de la structure"
echo ""

# Vérifier que les fichiers critiques existent
critical_files=(
    "src/App.tsx"
    "src/main.tsx"
    "src/lib/supabase/client.ts"
    "src/components/layout/Header.tsx"
    "src/components/layout/Footer.tsx"
)

all_ok=true
for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        log_success "✓ $file"
    else
        log_error "✗ $file MANQUANT"
        all_ok=false
    fi
done

# Afficher la structure créée
log_info ""
log_info "Structure créée:"
tree -L 2 src/ -I 'node_modules' 2>/dev/null || find src/ -maxdepth 2 -type d

# Phase 6: Nettoyage (optionnel)
log_info ""
log_warning "=========================================="
log_warning "NETTOYAGE DES DOUBLONS (OPTIONNEL)"
log_warning "=========================================="
echo ""
log_warning "Les dossiers suivants sont maintenant des doublons:"
log_warning "  - webandoh/"
log_warning "  - new_andoh-dohgad/"
echo ""
read -p "Voulez-vous les supprimer maintenant? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Suppression de webandoh/..."
    rm -rf webandoh/
    log_info "Suppression de new_andoh-dohgad/..."
    rm -rf new_andoh-dohgad/
    log_success "Doublons supprimés"
else
    log_info "Les dossiers ont été conservés. Vous pouvez les supprimer manuellement plus tard."
fi

# Résumé final
log_info ""
log_success "=========================================="
log_success "RÉPARATION TERMINÉE!"
log_success "=========================================="
echo ""

if [ "$all_ok" = true ]; then
    log_success "✅ Tous les fichiers critiques sont présents"
else
    log_warning "⚠️  Certains fichiers critiques sont manquants (voir ci-dessus)"
fi

echo ""
log_info "Prochaines étapes:"
echo ""
echo "1. Configurer .env.local avec vos vraies clés API:"
echo "   - VITE_SUPABASE_URL"
echo "   - VITE_SUPABASE_ANON_KEY"
echo "   - VITE_STRIPE_PUBLIC_KEY"
echo "   - VITE_EMAILJS_SERVICE_ID, etc."
echo ""
echo "2. Démarrer le serveur de développement:"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "3. Accéder à l'application:"
echo "   ${BLUE}http://localhost:3000${NC}"
echo ""
echo "4. Tester les fonctionnalités:"
echo "   - Pages publiques"
echo "   - Formulaires de contact"
echo "   - Login admin (/login)"
echo "   - Dashboard admin (/admin/dashboard)"
echo ""
echo "5. Consulter DIAGNOSTIC_COMPLET.md pour plus de détails"
echo ""

log_success "Script terminé avec succès!"
