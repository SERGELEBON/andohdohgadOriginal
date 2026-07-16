import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/supabaseClient';
import { Shield, Loader2, CheckCircle, UserPlus } from 'lucide-react';

export default function SuperAdminLogin() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Initialisation...');
  const [step, setStep] = useState('check');
  const navigate = useNavigate();

  useEffect(() => {
    autoSetupAndLogin();
  }, []);

  const autoSetupAndLogin = async () => {
    try {
      const email = import.meta.env.VITE_SUPER_ADMIN_EMAIL;
      const password = import.meta.env.VITE_SUPER_ADMIN_PASSWORD;

      if (!email || !password) {
        throw new Error('Identifiants super admin non configurés dans .env.local');
      }

      // Étape 1 : Vérifier si l'utilisateur existe
      setStep('check');
      setMessage('Vérification du compte super admin...');

      const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (existingUser?.user) {
        // L'utilisateur existe et peut se connecter
        setStep('success');
        setMessage('Connexion réussie !');

        // Vérifier/mettre à jour le rôle admin
        await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', existingUser.user.id);

        setStatus('success');
        setMessage('✅ Super Admin connecté ! Redirection...');

        setTimeout(() => {
          navigate('/admin');
        }, 1500);
        return;
      }

      // Étape 2 : Si l'utilisateur n'existe pas ou l'email n'est pas confirmé
      if (checkError?.message?.includes('Email not confirmed')) {
        setStep('confirm');
        setMessage('Email non confirmé. Tentative de confirmation automatique...');

        // Récupérer l'utilisateur via admin API (nécessiterait service_role)
        // Pour le moment, on affiche un message clair
        throw new Error('Le compte existe mais l\'email n\'est pas confirmé. Allez dans Supabase Dashboard → Auth → Users → Trouver ' + email + ' → 3 points (...) → Confirm email');
      }

      // Étape 3 : Créer le compte s'il n'existe pas
      if (checkError?.message?.includes('Invalid login credentials')) {
        setStep('create');
        setMessage('Création du compte super admin...');

        const { data: newUser, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: 'Super',
              last_name: 'Admin',
            },
            emailRedirectTo: undefined, // Pas de redirection
          }
        });

        if (signUpError) throw signUpError;

        if (newUser?.user) {
          setMessage('⚠️ Compte créé ! Confirmation d\'email requise.');
          throw new Error('Compte créé avec succès. Allez dans Supabase Dashboard → Auth → Users → Trouver ' + email + ' → 3 points (...) → Confirm email. Puis revenez sur cette page.');
        }
      }

      throw checkError || new Error('Erreur de connexion inconnue');

    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-primary to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Super Admin</h1>
            <p className="text-white/70">Configuration automatique</p>
          </div>

          {/* Progress steps */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`w-3 h-3 rounded-full ${step === 'check' ? 'bg-white animate-pulse' : step === 'create' || step === 'confirm' || step === 'success' ? 'bg-emerald-400' : 'bg-white/30'}`}></div>
            <div className="w-8 h-0.5 bg-white/30"></div>
            <div className={`w-3 h-3 rounded-full ${step === 'create' || step === 'confirm' ? 'bg-white animate-pulse' : step === 'success' ? 'bg-emerald-400' : 'bg-white/30'}`}></div>
            <div className="w-8 h-0.5 bg-white/30"></div>
            <div className={`w-3 h-3 rounded-full ${step === 'success' ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`}></div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              {status === 'loading' && (
                <>
                  {step === 'check' && <Loader2 className="w-12 h-12 text-white animate-spin" />}
                  {step === 'create' && <UserPlus className="w-12 h-12 text-blue-400 animate-pulse" />}
                  {step === 'confirm' && <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />}
                  {step === 'success' && <CheckCircle className="w-12 h-12 text-emerald-400" />}
                </>
              )}
              {status === 'success' && (
                <CheckCircle className="w-12 h-12 text-emerald-400" />
              )}
              {status === 'error' && (
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">❌</span>
                </div>
              )}
            </div>

            <p className={`text-center font-medium text-sm mb-2 ${
              status === 'success' ? 'text-emerald-300' :
              status === 'error' ? 'text-red-300' :
              'text-white'
            }`}>
              {message}
            </p>

            {status === 'error' && message.includes('Supabase Dashboard') && (
              <div className="mt-4 p-3 bg-amber-500/20 rounded-lg border border-amber-500/30">
                <p className="text-amber-200 text-xs mb-2">📋 Instructions :</p>
                <ol className="text-xs text-amber-100 space-y-1 list-decimal list-inside">
                  <li>Ouvrir Supabase Dashboard</li>
                  <li>Aller dans Auth → Users</li>
                  <li>Trouver {import.meta.env.VITE_SUPER_ADMIN_EMAIL}</li>
                  <li>Cliquer (...) → Confirm email</li>
                  <li>Revenir ici et cliquer "Réessayer"</li>
                </ol>
              </div>
            )}
          </div>

          {status === 'error' && (
            <>
              <button
                onClick={autoSetupAndLogin}
                className="w-full px-6 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-all mb-3"
              >
                Réessayer
              </button>
              <a
                href="https://supabase.com/dashboard/project/tszsvbzfufglvdcsjzpo/auth/users"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-3 bg-white/20 text-white text-center font-semibold rounded-xl hover:bg-white/30 transition-all"
              >
                Ouvrir Supabase Dashboard
              </a>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-white/50 text-xs text-center mb-2">
              Email: {import.meta.env.VITE_SUPER_ADMIN_EMAIL}
            </p>
            <p className="text-white/40 text-xs text-center">
              Étape : {step === 'check' ? 'Vérification' : step === 'create' ? 'Création' : step === 'confirm' ? 'Confirmation' : 'Connexion'}
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            Configuration automatique • Environnement de développement
          </p>
        </div>
      </div>
    </div>
  );
}
