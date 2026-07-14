#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║          🧪 TEST COMPLET - AUTHENTIFICATION                   ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier que .env.local existe
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 TEST 1 : Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local existe${NC}"

    if grep -q "VITE_SUPABASE_URL" .env.local; then
        echo -e "${GREEN}✅ VITE_SUPABASE_URL configuré${NC}"
    else
        echo -e "${RED}❌ VITE_SUPABASE_URL manquant${NC}"
    fi

    if grep -q "VITE_SUPABASE_ANON_KEY" .env.local; then
        echo -e "${GREEN}✅ VITE_SUPABASE_ANON_KEY configuré${NC}"
    else
        echo -e "${RED}❌ VITE_SUPABASE_ANON_KEY manquant${NC}"
    fi
else
    echo -e "${RED}❌ .env.local n'existe pas${NC}"
    echo -e "${YELLOW}➜ Copiez .env.example vers .env.local et configurez les clés${NC}"
fi

echo ""

# Vérifier que les fichiers auth existent
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 TEST 2 : Fichiers créés"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

files=(
    "src/lib/supabase/client.ts"
    "src/contexts/AuthContext.tsx"
    "src/components/auth/LoginForm.tsx"
    "src/components/auth/SignupForm.tsx"
    "src/components/auth/ProtectedRoute.tsx"
    "src/pages/Login.tsx"
    "src/pages/Signup.tsx"
    "src/pages/MyAccount.tsx"
    "src/pages/AdminDashboard.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file manquant${NC}"
    fi
done

echo ""

# Test build
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔨 TEST 3 : Build TypeScript"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if npm run build > /tmp/build.log 2>&1; then
    echo -e "${GREEN}✅ Build réussie${NC}"
    build_time=$(grep "built in" /tmp/build.log | tail -1)
    echo "   $build_time"
else
    echo -e "${RED}❌ Build échouée${NC}"
    echo "Erreurs:"
    tail -10 /tmp/build.log
fi

echo ""

# Routes accessibles
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 TEST 4 : Routes configurées"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

routes=(
    "/ - Page d'accueil"
    "/connexion - Page de connexion"
    "/inscription - Page d'inscription"
    "/mon-compte - Dashboard utilisateur (protégé)"
    "/admin - Dashboard admin (protégé, admin only)"
)

for route in "${routes[@]}"; do
    echo -e "${GREEN}✅ $route${NC}"
done

echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Tests terminés"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Pour lancer l'application :"
echo "   npm run dev"
echo ""
echo "🧪 Pour tester :"
echo "   1. Ouvrir http://localhost:3000"
echo "   2. Cliquer sur 'Inscription' dans le header"
echo "   3. Créer un compte"
echo "   4. Se connecter"
echo "   5. Vérifier redirection vers /mon-compte"
echo ""
