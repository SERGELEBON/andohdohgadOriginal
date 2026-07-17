# 📧 Configuration Email Supabase - Réinitialisation Mot de Passe

**Date** : 2026-07-17

---

## 🎯 Configuration Requise

Pour que la réinitialisation de mot de passe fonctionne, configurez les templates d'emails dans Supabase.

---

## 📋 Étapes de Configuration

### 1. Accéder aux Email Templates

**URL** : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/auth/templates

### 2. Configurer "Reset Password" Template

Cliquez sur **"Reset Password"** dans la liste des templates.

#### **Subject**
```
Réinitialisation de votre mot de passe - Andoh & Dohgad Consulting
```

#### **Body (HTML)**
```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation de mot de passe</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #5C0F8B 0%, #8B1A1A 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                🔒 Réinitialisation de mot de passe
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Bonjour,
              </p>

              <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                Vous avez demandé à réinitialiser votre mot de passe pour votre compte <strong>Andoh & Dohgad Consulting</strong>.
              </p>

              <p style="margin: 0 0 30px; color: #374151; font-size: 16px; line-height: 1.6;">
                Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="{{ .ConfirmationURL }}" 
                       style="display: inline-block; background: linear-gradient(135deg, #5C0F8B 0%, #8B1A1A 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(92, 15, 139, 0.3);">
                      Réinitialiser mon mot de passe
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Info Box -->
              <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px; color: #92400E; font-size: 14px; font-weight: bold;">
                  ⚠️ Informations importantes :
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #92400E; font-size: 14px; line-height: 1.6;">
                  <li>Ce lien est valide pendant <strong>1 heure</strong></li>
                  <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
                  <li>Pour votre sécurité, choisissez un mot de passe fort (8+ caractères, majuscules, chiffres, caractères spéciaux)</li>
                </ul>
              </div>

              <p style="margin: 30px 0 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
              </p>
              <p style="margin: 10px 0 0; word-break: break-all;">
                <a href="{{ .ConfirmationURL }}" style="color: #5C0F8B; font-size: 13px; text-decoration: underline;">
                  {{ .ConfirmationURL }}
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 10px; color: #6B7280; font-size: 14px;">
                <strong>Andoh & Dohgad Consulting</strong>
              </p>
              <p style="margin: 0 0 10px; color: #6B7280; font-size: 12px;">
                📧 contact@andoh-dohgad.com | 📞 +225 XX XX XX XX XX
              </p>
              <p style="margin: 0; color: #9CA3AF; font-size: 11px;">
                Abidjan, Côte d'Ivoire
              </p>
              <p style="margin: 15px 0 0; color: #9CA3AF; font-size: 11px;">
                © 2026 Andoh & Dohgad Consulting. Tous droits réservés.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 🔧 Paramètres Auth Supplémentaires

### 3. Vérifier les Paramètres URL

**URL** : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/auth/url-configuration

**Site URL** : `https://andoh-dohgad.netlify.app`

**Redirect URLs** (ajouter si manquant) :
```
https://andoh-dohgad.netlify.app/reset-password
http://localhost:5173/reset-password
```

### 4. Email Auth Settings

**URL** : https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/settings/auth

**Paramètres à vérifier** :
- ✅ **Enable Email Confirmations** : Activé
- ✅ **Secure Email Change** : Activé
- ✅ **Email Rate Limit** : 10 emails / heure (par défaut)

---

## ✅ Vérification Finale

### Test du Flow Complet

1. **Allez sur** : https://andoh-dohgad.netlify.app/connexion
2. **Cliquez** sur "Mot de passe oublié ?"
3. **Entrez** votre email
4. **Vérifiez** votre boîte mail
5. **Cliquez** sur le lien reçu
6. **Créez** un nouveau mot de passe
7. **Connectez-vous** avec le nouveau mot de passe

---

## 🎨 Variantes de Template (Optionnel)

### Version Texte Brut

Pour les clients email ne supportant pas HTML :

```
Réinitialisation de votre mot de passe - Andoh & Dohgad Consulting

Bonjour,

Vous avez demandé à réinitialiser votre mot de passe.

Cliquez sur ce lien pour créer un nouveau mot de passe :
{{ .ConfirmationURL }}

Ce lien est valide pendant 1 heure.

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

---
Andoh & Dohgad Consulting
contact@andoh-dohgad.com
Abidjan, Côte d'Ivoire
```

---

## 🔐 Bonnes Pratiques Implémentées

✅ **Sécurité**
- Lien à usage unique
- Expiration après 1h
- Pas de révélation si l'email existe ou non
- Validation forte du mot de passe (8+ caractères, majuscules, chiffres, spéciaux)

✅ **UX**
- Messages clairs à chaque étape
- Indicateur de force du mot de passe en temps réel
- Vérification des critères avec icônes visuelles
- Redirection automatique après succès

✅ **Design**
- Email responsive et professionnel
- Couleurs de la marque (violet/marron)
- Bouton CTA bien visible
- Informations importantes mises en avant

---

## 📝 Notes Importantes

- **Limite de débit** : Supabase limite les emails à 10/heure par email pour éviter le spam
- **Développement local** : Utilisez `http://localhost:5173` pour tester en local
- **Production** : Assurez-vous que `https://andoh-dohgad.netlify.app` est dans les Redirect URLs

---

**Configuration terminée !** 🎉
