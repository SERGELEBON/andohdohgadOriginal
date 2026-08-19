import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/supabaseClient';

/**
 * Page de callback après confirmation email
 * Redirige l'utilisateur vers son compte après authentification
 */
export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);

      if (event === 'SIGNED_IN' && session) {
        // Rediriger vers le compte utilisateur
        navigate('/mon-compte');
      } else if (event === 'PASSWORD_RECOVERY') {
        // Rediriger vers la page de réinitialisation
        navigate('/reset-password');
      }
    });

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

        <h2 className="text-2xl font-bold text-dark mb-4">
          Confirmation en cours...
        </h2>

        <p className="text-body mb-4">
          Veuillez patienter pendant que nous vérifions votre compte.
        </p>

        <p className="text-sm text-gray-500">
          Vous allez être redirigé automatiquement.
        </p>
      </div>
    </div>
  );
}