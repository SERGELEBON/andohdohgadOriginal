#!/bin/bash
# Script pour ajouter les variables d'environnement sur Netlify
# Assurez-vous d'être authentifié avec: netlify login

echo "🔧 Configuration des variables d'environnement Netlify..."
echo ""

# Vérifier que netlify CLI est installé
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI n'est pas installé"
    echo "Installez-le avec: npm install -g netlify-cli"
    exit 1
fi

# Vérifier que le site est lié
if [ ! -f ".netlify/state.json" ]; then
    echo "⚠️  Site non lié. Exécutez d'abord: netlify link"
    echo "Ou exécutez ce script depuis le répertoire du projet"
    exit 1
fi

# Ajouter les variables une par une
echo "Ajout des variables d'environnement..."

netlify env:set VITE_SUPABASE_URL "https://tszsvbzfufglvdcsjzpo.supabase.co" && echo "✅ VITE_SUPABASE_URL ajoutée"

netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzenN2YnpmdWZnbHZkY3NqenBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMDYwMjcsImV4cCI6MjA5ODc4MjAyN30.vr_Ogp2zk7hrl3gR7m-yt3T_nBO7sJCR0vkX0DMJ__c" && echo "✅ VITE_SUPABASE_ANON_KEY ajoutée"

netlify env:set VITE_EMAILJS_SERVICE_ID "service_qtc3k0o" && echo "✅ VITE_EMAILJS_SERVICE_ID ajoutée"

netlify env:set VITE_EMAILJS_TEMPLATE_ID "template_1l8t012" && echo "✅ VITE_EMAILJS_TEMPLATE_ID ajoutée"

netlify env:set VITE_EMAILJS_PUBLIC_KEY "jAfoT8qEUMzZ6WLf5" && echo "✅ VITE_EMAILJS_PUBLIC_KEY ajoutée"

netlify env:set VITE_APP_URL "https://andoh-dohgad.netlify.app" && echo "✅ VITE_APP_URL ajoutée"

netlify env:set VITE_SUPER_ADMIN_EMAIL "contact@andoh-dohgad.com" && echo "✅ VITE_SUPER_ADMIN_EMAIL ajoutée"

netlify env:set VITE_SUPER_ADMIN_PASSWORD "SuperAdmin@2026!" && echo "✅ VITE_SUPER_ADMIN_PASSWORD ajoutée"

echo ""
echo "✅ Toutes les variables ont été ajoutées avec succès !"
echo ""
echo "🚀 Déployez maintenant avec: netlify deploy --prod"
echo "   ou attendez que Netlify redéploie automatiquement"
