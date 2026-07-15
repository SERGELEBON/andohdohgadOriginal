#!/bin/bash
# Vercel Build Diagnostic Script
# This script simulates the Vercel build process locally

echo "=== Vercel Build Diagnostic ==="
echo ""

echo "1. Node version:"
node --version

echo ""
echo "2. NPM version:"
npm --version

echo ""
echo "3. Current directory:"
pwd

echo ""
echo "4. Checking critical files:"
ls -la vite.config.ts vercel.json package.json

echo ""
echo "5. Checking src/lib/supabase:"
ls -la src/lib/supabase/

echo ""
echo "6. Checking environment variables (names only):"
env | grep "^VITE_" | cut -d= -f1 || echo "No VITE_ variables found"

echo ""
echo "7. Installing dependencies:"
npm install

echo ""
echo "8. Running build:"
npm run build

echo ""
echo "9. Checking dist output:"
ls -la dist/ || echo "dist/ directory not found"

echo ""
echo "=== Build Diagnostic Complete ==="
