#!/bin/bash

# ===============================================
# Script de vérification du fix signup
# Date : 2026-08-11
# ===============================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   VÉRIFICATION DU FIX SIGNUP ERROR 500${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Fonction de vérification
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        return 0
    else
        echo -e "${RED}❌ $1${NC}"
        return 1
    fi
}

# ===============================================
# 1. Vérifier que les fichiers modifiés existent
# ===============================================

echo -e "${YELLOW}[1/6] Vérification des fichiers modifiés...${NC}"
echo ""

if [ -f "src/contexts/AuthContext.tsx" ]; then
    if grep -q "Pas de emailRedirectTo" src/contexts/AuthContext.tsx; then
        check "AuthContext.tsx modifié correctement"
    else
        echo -e "${RED}❌ AuthContext.tsx non modifié${NC}"
        echo -e "${YELLOW}   Exécuter : git diff src/contexts/AuthContext.tsx${NC}"
    fi
else
    echo -e "${RED}❌ src/contexts/AuthContext.tsx manquant${NC}"
fi

if [ -f "src/pages/auth/AuthCallback.tsx" ]; then
    check "AuthCallback.tsx créé"
else
    echo -e "${RED}❌ src/pages/auth/AuthCallback.tsx manquant${NC}"
fi

if [ -f "src/App.tsx" ]; then
    if grep -q "/auth/callback" src/App.tsx; then
        check "Route /auth/callback ajoutée dans App.tsx"
    else
        echo -e "${RED}❌ Route /auth/callback manquante dans App.tsx${NC}"
    fi
else
    echo -e "${RED}❌ src/App.tsx manquant${NC}"
fi

echo ""

# ===============================================
# 2. Vérifier que le script SQL existe
# ===============================================

echo -e "${YELLOW}[2/6] Vérification du script SQL...${NC}"
echo ""

if [ -f "supabase/FIX_SIGNUP_TRIGGER_FINAL.sql" ]; then
    check "Script SQL FIX_SIGNUP_TRIGGER_FINAL.sql disponible"

    # Compter les lignes
    lines=$(wc -l < supabase/FIX_SIGNUP_TRIGGER_FINAL.sql)
    echo -e "${BLUE}   └─ $lines lignes${NC}"
else
    echo -e "${RED}❌ supabase/FIX_SIGNUP_TRIGGER_FINAL.sql manquant${NC}"
fi

echo ""

# ===============================================
# 3. Vérifier les dépendances npm
# ===============================================

echo -e "${YELLOW}[3/6] Vérification des dépendances npm...${NC}"
echo ""

if [ -f "package.json" ]; then
    # Vérifier @supabase/supabase-js
    if grep -q "@supabase/supabase-js" package.json; then
        version=$(grep "@supabase/supabase-js" package.json | sed 's/.*"@supabase\/supabase-js": "\^*\([0-9.]*\)".*/\1/')
        check "@supabase/supabase-js version $version installé"
    else
        echo -e "${RED}❌ @supabase/supabase-js non trouvé dans package.json${NC}"
    fi

    # Vérifier react-router-dom
    if grep -q "react-router-dom" package.json; then
        check "react-router-dom installé"
    else
        echo -e "${RED}❌ react-router-dom non trouvé${NC}"
    fi
else
    echo -e "${RED}❌ package.json manquant${NC}"
fi

echo ""

# ===============================================
# 4. Vérifier la configuration .env.local
# ===============================================

echo -e "${YELLOW}[4/6] Vérification de .env.local...${NC}"
echo ""

if [ -f ".env.local" ]; then
    # Vérifier VITE_SUPABASE_URL
    if grep -q "VITE_SUPABASE_URL=https://tszsvbzfufglvdcsjzpo.supabase.co" .env.local; then
        check "VITE_SUPABASE_URL configuré"
    else
        echo -e "${RED}❌ VITE_SUPABASE_URL manquant ou incorrect${NC}"
    fi

    # Vérifier VITE_SUPABASE_ANON_KEY
    if grep -q "VITE_SUPABASE_ANON_KEY=eyJ" .env.local; then
        check "VITE_SUPABASE_ANON_KEY configuré"
    else
        echo -e "${RED}❌ VITE_SUPABASE_ANON_KEY manquant${NC}"
    fi

    # Avertissement sécurité
    echo ""
    echo -e "${YELLOW}⚠️  AVERTISSEMENT SÉCURITÉ :${NC}"
    echo -e "${YELLOW}   .env.local NE DOIT PAS être committé dans Git${NC}"

    if git ls-files --error-unmatch .env.local 2>/dev/null; then
        echo -e "${RED}   ❌ .env.local est tracké par Git ! DANGER !${NC}"
        echo -e "${YELLOW}   Exécuter : git rm --cached .env.local${NC}"
    else
        check ".env.local n'est pas tracké par Git"
    fi
else
    echo -e "${YELLOW}⚠️  .env.local manquant${NC}"
    echo -e "${YELLOW}   Copier .env.local.template et configurer les variables${NC}"
fi

echo ""

# ===============================================
# 5. Tester le build
# ===============================================

echo -e "${YELLOW}[5/6] Test du build...${NC}"
echo ""

echo -e "${BLUE}   Building...${NC}"
if npm run build > /tmp/build-output.log 2>&1; then
    check "Build réussi"

    # Vérifier la taille du bundle
    if [ -f "dist/assets/index-*.js" ]; then
        size=$(du -sh dist/assets/index-*.js | cut -f1)
        echo -e "${BLUE}   └─ Bundle size: $size${NC}"
    fi
else
    echo -e "${RED}❌ Build échoué${NC}"
    echo -e "${YELLOW}   Voir les détails : cat /tmp/build-output.log${NC}"
fi

echo ""

# ===============================================
# 6. Résumé et prochaines étapes
# ===============================================

echo -e "${YELLOW}[6/6] Prochaines étapes...${NC}"
echo ""

echo -e "${BLUE}📋 ÉTAPES À FAIRE MANUELLEMENT :${NC}"
echo ""
echo -e "1. ${YELLOW}Appliquer le script SQL dans Supabase${NC}"
echo -e "   👉 Copier : ${GREEN}supabase/FIX_SIGNUP_TRIGGER_FINAL.sql${NC}"
echo -e "   👉 Coller dans Supabase SQL Editor et exécuter"
echo ""
echo -e "2. ${YELLOW}Configurer les Redirect URLs${NC}"
echo -e "   👉 Supabase Dashboard > Authentication > URL Configuration"
echo -e "   👉 Ajouter :"
echo -e "      - http://localhost:3000"
echo -e "      - http://localhost:3000/*"
echo -e "      - https://andoh-dohgad.netlify.app"
echo -e "      - https://andoh-dohgad.netlify.app/*"
echo ""
echo -e "3. ${YELLOW}Désactiver email confirmation (DEV uniquement)${NC}"
echo -e "   👉 Supabase Dashboard > Authentication > Providers > Email"
echo -e "   👉 Décocher 'Confirm email'"
echo ""
echo -e "4. ${YELLOW}Tester le signup${NC}"
echo -e "   👉 Démarrer : ${GREEN}npm run dev${NC}"
echo -e "   👉 Ouvrir : ${GREEN}http://localhost:3000/inscription${NC}"
echo -e "   👉 S'inscrire avec un nouvel email"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ VÉRIFICATION TERMINÉE${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📖 Pour plus de détails, consulter :${NC}"
echo -e "   - ${GREEN}GUIDE_REPARATION_SIGNUP.md${NC}"
echo -e "   - ${GREEN}FIX_SIGNUP_ERROR_500.md${NC}"
echo ""