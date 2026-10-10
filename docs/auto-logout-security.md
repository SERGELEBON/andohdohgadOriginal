# 🔒 Système de Déconnexion Automatique

## Vue d'ensemble

Le système de déconnexion automatique implémente les **meilleures pratiques de sécurité** pour protéger les comptes utilisateurs contre les accès non autorisés.

## Fonctionnalités

### 1. Déconnexion par Inactivité
- **Délai**: 30 minutes d'inactivité
- **Détection**: Mouvements souris, clavier, tactile, scroll, clics
- **Warning**: Notification 2 minutes avant déconnexion
- **Action**: Possibilité d'étendre la session en cliquant "Rester connecté"

### 2. Durée Maximale de Session
- **Limite**: 24 heures maximum
- **Raison**: Sécurité même si l'utilisateur est actif
- **Action**: Déconnexion automatique après 24h

### 3. Notification Utilisateur
- **Warning pop-up**: Apparaît 2 minutes avant déconnexion
- **Compte à rebours**: Affichage du temps restant
- **Barre de progression**: Visuel du temps écoulé
- **Options**: "Rester connecté" ou "Ignorer"

### 4. Message Post-Déconnexion
- **Notification**: Alerte jaune sur la page d'accueil
- **Information**: Explique pourquoi la déconnexion a eu lieu
- **Fermeture**: Bouton X pour masquer

## Architecture Technique

### Fichiers Créés

1. **`src/hooks/useAutoLogout.ts`**
   - Hook React personnalisé
   - Gère les timers d'inactivité et de session max
   - Détecte l'activité utilisateur
   - Callbacks: onWarning, onLogout

2. **`src/components/auth/SessionWarning.tsx`**
   - Composant de notification
   - Compte à rebours visuel
   - Boutons d'action
   - Animation smooth

3. **`src/App.tsx`** (modifié)
   - Composant `AutoLogoutManager`
   - Intégration du hook
   - Gestion des warnings
   - Redirection après déconnexion

4. **`src/pages/public/Home.tsx`** (modifié)
   - Notification session expirée
   - Détection query param `?session_expired=true`
   - Auto-dismiss du message

## Paramètres de Configuration

```typescript
// src/hooks/useAutoLogout.ts

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const MAX_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 heures
const WARNING_BEFORE_LOGOUT = 2 * 60 * 1000; // 2 minutes avant
```

### Personnalisation

Pour modifier les délais, éditez les constantes dans `useAutoLogout.ts`:

```typescript
// Exemple: 15 minutes d'inactivité
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

// Exemple: 12 heures de session max
const MAX_SESSION_DURATION = 12 * 60 * 60 * 1000;

// Exemple: Warning 5 minutes avant
const WARNING_BEFORE_LOGOUT = 5 * 60 * 1000;
```

## Événements Détectés

Le système considère les événements suivants comme "activité":

- `mousedown` - Clic souris
- `mousemove` - Mouvement souris
- `keypress` - Frappe clavier
- `scroll` - Défilement
- `touchstart` - Toucher écran tactile
- `click` - Clic général

## Optimisations

### Debouncing
- **Fréquence**: Max 1 reset de timer par 5 secondes
- **Raison**: Éviter les resets trop fréquents
- **Avantage**: Performance optimale

### Cleanup
- **useEffect cleanup**: Tous les timers sont cleared
- **Event listeners**: Supprimés au démontage
- **Memory leaks**: Prévenus

## Meilleures Pratiques Respectées

✅ **OWASP Top 10**
- A07:2021 – Identification and Authentication Failures

✅ **NIST Guidelines**
- Session timeout après inactivité
- Durée maximale de session
- Notification avant déconnexion

✅ **RGPD / Privacy**
- Protection des données utilisateur
- Auto-logout prévient accès non autorisé

✅ **UX Best Practices**
- Warning 2 minutes avant
- Compte à rebours visuel
- Option d'extension de session
- Message informatif post-logout

## Flux Utilisateur

### Scénario 1: Inactivité
```
1. Utilisateur connecté, inactif
2. Après 28 minutes → Pop-up warning apparaît
3. Compte à rebours: 2:00... 1:59... 1:58...
4. Option 1: Clic "Rester connecté" → Session étendue, timer reset
5. Option 2: Ignore/ferme → Déconnexion après 2 min
6. Redirection vers accueil avec message
```

### Scénario 2: Session Maximale
```
1. Utilisateur connecté depuis 24h
2. Déconnexion automatique immédiate
3. Redirection vers accueil
4. Message: "Session expirée pour sécurité"
```

### Scénario 3: Utilisateur Actif
```
1. Utilisateur bouge la souris, clique, tape
2. Timer reset automatiquement
3. Session reste active
4. Pas de warning
```

## Sécurité

### Pourquoi c'est important ?

1. **Accès non autorisé**: Si l'utilisateur quitte son poste sans se déconnecter
2. **Sessions volées**: Limite les dégâts d'une session hijackée
3. **Conformité**: Respect des normes de sécurité (ISO 27001, SOC 2)
4. **Best practice**: Standard dans toutes applications professionnelles

### Cas d'usage

- **Bureau partagé**: Empêche collègue d'accéder au compte
- **Café/Bibliothèque**: Protection en lieu public
- **Ordinateur volé**: Limite la fenêtre d'exploitation
- **Session oubliée**: Fermeture automatique

## Testing

### Test Manuel

1. **Test Inactivité**:
   - Se connecter
   - Attendre 28 minutes (ou réduire INACTIVITY_TIMEOUT pour test)
   - Vérifier apparition du warning
   - Vérifier compte à rebours
   - Tester "Rester connecté"

2. **Test Session Max**:
   - Réduire MAX_SESSION_DURATION à 1 minute pour test
   - Se connecter
   - Être actif (bouger souris)
   - Vérifier déconnexion après 1 minute

3. **Test Activité**:
   - Se connecter
   - Bouger souris régulièrement
   - Vérifier pas de déconnexion

## Logs

Le système log dans la console navigateur:

```
⏱️ Inactivity timeout reached
⚠️ Warning: Session will expire in 2 minutes
⏱️ Max session duration (24h) reached
🔒 Auto-logout triggered
```

## Désactivation (Non recommandé)

Pour désactiver temporairement (dev uniquement):

```typescript
// Dans App.tsx - AutoLogoutManager
const { resetTimer } = useAutoLogout({
  enabled: false, // ← Désactive
  // ...
});
```

⚠️ **NE JAMAIS désactiver en production !**

## Support & Questions

Pour toute question sur le système de sécurité:
- Voir documentation: `/docs/auto-logout-security.md`
- Modifier paramètres: `src/hooks/useAutoLogout.ts`
- Customiser UI: `src/components/auth/SessionWarning.tsx`
