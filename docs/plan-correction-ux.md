# 📋 PLAN DE CORRECTION UX - Andoh & Dohgad

## 🔴 PROBLÈME 1: Site difficile à utiliser sur mobile
**Priorité**: ⭐⭐⭐ CRITIQUE  
**Impact**: Visiteurs depuis réseaux sociaux (majorité mobile)

### Diagnostic détaillé nécessaire:
1. ✅ **Navigation mobile**
   - Menu burger fonctionnel ✅
   - Overlay full-screen ✅
   - MAIS: Vérifier taille tactile des liens (min 44x44px recommandé)

2. ❌ **Formulaires sur mobile**
   - Champs trop petits?
   - Labels lisibles?
   - Boutons submit assez grands?

3. ❌ **Cartes de services**
   - Images bien visibles? ✅ (corrigé récemment)
   - Texte lisible?
   - Padding suffisant?

4. ❌ **Espacement tactile**
   - 8px minimum entre éléments cliquables
   - Boutons CTA assez grands (min 48px hauteur)

### Actions correctives:

#### A. Améliorer la navigation mobile
```tsx
// Header.tsx - Augmenter zone tactile
className="py-4 px-3"  // au lieu de py-2
```

#### B. Optimiser les formulaires
```tsx
// Inputs plus grands sur mobile
className="h-12 md:h-11"  // au lieu de h-11
className="text-base md:text-sm"  // empêcher zoom iOS
```

#### C. Améliorer les CTA
```tsx
// Boutons plus grands sur mobile
className="py-4 px-6 md:py-3 md:px-5"
className="min-h-[48px]"  // accessibilité
```

#### D. Test mobile obligatoire
- iPhone SE (375px)
- iPhone 12/13/14 (390px)
- Android standard (360px)

---

## 🟡 PROBLÈME 2: Accents manquants sur le contenu éditorial
**Priorité**: ⭐⭐⭐ CRITIQUE  
**Impact**: Crédibilité professionnelle

### Exemples trouvés:
```
❌ "Fonde a Abidjan"  → ✅ "Fondé à Abidjan"
❌ "strategie"         → ✅ "stratégie"
❌ "equipe"            → ✅ "équipe"
❌ "croyons fermement" → OK
```

### Cause probable:
- ❌ Encodage UTF-8 mal configuré en base de données
- ❌ Ou données saisies sans accents

### Fichiers à corriger (grep effectué):

#### Services.tsx
```tsx
// Ligne actuelle
subtitle="Des solutions completes et personnalisees..."

// Correction
subtitle="Des solutions complètes et personnalisées..."
```

#### About.tsx, BlogPost.tsx, Coworking.tsx, etc.
- Tous les textes sans accents à corriger

### Actions:

#### Option 1: Correction manuelle (RAPIDE - recommandé)
1. Chercher tous les textes sans accents dans `/src`
2. Remplacer par texte accentué
3. Commit + push

#### Option 2: Vérifier l'encodage base de données
```sql
-- Vérifier l'encodage Supabase
SHOW SERVER_ENCODING;
-- Devrait être UTF8

-- Vérifier table cms_content
SELECT pg_encoding_to_char(encoding) 
FROM pg_database 
WHERE datname = current_database();
```

### Commande de recherche:
```bash
# Trouver tous les fichiers avec texte sans accents
grep -rn "strategie\|equipe\|creee\|Fonde" src/ --include="*.tsx" --include="*.ts"
```

---

## 🟠 PROBLÈME 3: Code HTML brut visible (`&apos;`)
**Priorité**: ⭐⭐ HAUTE  
**Impact**: Expérience utilisateur dégradée

### Exemples trouvés:
```tsx
❌ "L&apos;exactitude"  → ✅ "L'exactitude"
❌ "d&apos;Abidjan"     → ✅ "d'Abidjan"
❌ "l&apos;accompagnement" → ✅ "l'accompagnement"
```

### Fichiers concernés (confirmés):
1. `/src/pages/public/About.tsx` - 3 occurrences
2. `/src/pages/public/Coworking.tsx` - 4 occurrences
3. `/src/pages/public/Services.tsx` - 2 occurrences
4. `/src/pages/public/Contact.tsx` - 1 occurrence
5. Et d'autres...

### Cause:
React interprète `&apos;` comme du texte, pas comme une entité HTML.

### Solution:
Remplacer **toutes** les entités HTML par caractères UTF-8:

```tsx
// ❌ MAUVAIS
"L&apos;exactitude"
"d&apos;Abidjan"

// ✅ BON
"L'exactitude"
"d'Abidjan"
```

### Action automatisée:
```bash
# Rechercher toutes les occurrences
grep -r "&apos;" src/ --include="*.tsx" --include="*.ts"

# Remplacer automatiquement
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/&apos;/'/g"
```

---

## 📊 PRIORITÉS D'EXÉCUTION

### Phase 1 - URGENT (Aujourd'hui)
1. ✅ **Corriger `&apos;`** (5 min)
   - Remplacement automatique dans tous les fichiers
   
2. ✅ **Ajouter les accents manquants** (30 min)
   - Correction manuelle fichier par fichier
   - Vérifier Services, About, Blog, Contact, Coworking

### Phase 2 - IMPORTANT (Cette semaine)
3. 🔄 **Améliorer UX mobile** (2h)
   - Augmenter zones tactiles
   - Optimiser formulaires
   - Tester sur vrais devices

### Phase 3 - VÉRIFICATION (Après corrections)
4. 🧪 **Tests complets**
   - Test mobile (3 tailles d'écran)
   - Test formulaires
   - Vérification encodage

---

## 🛠️ COMMANDES RAPIDES

### 1. Corriger &apos;
```bash
find src/ \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i "s/&apos;/'/g" {} +
```

### 2. Trouver textes sans accents
```bash
grep -rn "\(strategie\|equipe\|creee\|Fonde\|a propos\|competences\)" src/ --include="*.tsx"
```

### 3. Tester mobile
```bash
# Ouvrir Chrome DevTools en mode mobile
# Ou utiliser:
npm run dev
# Puis tester avec navigateur mobile réel
```

---

## ✅ CHECKLIST POST-CORRECTION

- [ ] Plus aucun `&apos;` visible
- [ ] Tous les accents présents (é, è, ê, à, ù, ç, etc.)
- [ ] Formulaires utilisables sur mobile (iPhone SE 375px)
- [ ] Boutons CTA min 48px de hauteur
- [ ] Espacement tactile minimum 8px
- [ ] Test sur 3 devices: iPhone, Android, Tablet
- [ ] Validation W3C HTML
- [ ] Test Lighthouse Mobile > 80

---

## 📱 TESTS MOBILE RECOMMANDÉS

1. **Navigation**
   - [ ] Menu burger s'ouvre facilement
   - [ ] Tous les liens cliquables du premier coup
   - [ ] Pas de double-tap nécessaire

2. **Formulaires**
   - [ ] Champs assez grands (min 44px)
   - [ ] Labels lisibles
   - [ ] Clavier adapté (email, tel, number)
   - [ ] Pas de zoom automatique iOS

3. **Contenu**
   - [ ] Texte lisible (min 16px)
   - [ ] Images chargent correctement
   - [ ] Pas de scroll horizontal

4. **Performance**
   - [ ] Temps de chargement < 3s
   - [ ] Animations fluides (60fps)
   - [ ] Pas de lag au scroll
