import { toast } from 'sonner';

/**
 * Notifications non bloquantes (remplacent window.alert, qui fige la page).
 *
 * Règle de sécurité : on n'affiche jamais le message technique brut d'une erreur
 * (détails Supabase / SQL) à l'écran. Il part dans la console pour le débogage,
 * l'utilisateur voit un message clair.
 */
export const notify = {
  success: (message: string) => toast.success(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),
  error: (message: string, cause?: unknown) => {
    if (cause !== undefined) console.error(message, cause);
    toast.error(message);
  },
};
