import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/supabaseClient';

/**
 * Déconnexion automatique
 *
 * - Déconnexion après 30 minutes d'inactivité
 * - Déconnexion après 24h de session (même si actif)
 * - Avertissement 2 minutes avant
 *
 * Les horodatages sont stockés dans localStorage (et non en mémoire) pour que :
 * - la règle s'applique aussi après fermeture de l'onglet / du navigateur,
 *   rechargement de la page ou mise en veille de l'ordinateur ;
 * - plusieurs onglets ouverts partagent la même activité.
 *
 * Avant, les minuteurs étaient seulement en mémoire : en fermant l'onglet puis en
 * revenant plus tard, Supabase restaurait la session (persistSession) et
 * l'utilisateur restait connecté indéfiniment.
 */

export const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const MAX_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 heures
const WARNING_BEFORE_LOGOUT = 2 * 60 * 1000; // 2 minutes
const CHECK_INTERVAL = 15 * 1000; // vérification toutes les 15 s
const ACTIVITY_THROTTLE = 5 * 1000; // 1 enregistrement d'activité max toutes les 5 s

const LAST_ACTIVITY_KEY = 'ad_last_activity';
const SESSION_START_KEY = 'ad_session_start';

const readTs = (key: string): number | null => {
  try {
    const v = localStorage.getItem(key);
    const n = v ? Number(v) : NaN;
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
};

const writeTs = (key: string, value: number) => {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    /* stockage indisponible (navigation privée...) : on garde le fonctionnement en mémoire */
  }
};

const clearTs = () => {
  try {
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    localStorage.removeItem(SESSION_START_KEY);
  } catch {
    /* ignore */
  }
};

interface UseAutoLogoutOptions {
  enabled?: boolean;
  onWarning?: () => void;
  onLogout?: () => void;
}

export const useAutoLogout = (options: UseAutoLogoutOptions = {}) => {
  const { enabled = true, onWarning, onLogout } = options;
  const { user, signOut } = useAuth();
  const userId = user?.id ?? null;

  // Repli en mémoire si localStorage est indisponible
  const lastActivityMem = useRef<number>(0); // initialisé dans l'effet
  const sessionStartMem = useRef<number>(0);
  const warnedRef = useRef(false);
  const loggingOutRef = useRef(false);

  // Garder les callbacks à jour sans relancer l'effet principal
  const onWarningRef = useRef(onWarning);
  const onLogoutRef = useRef(onLogout);
  useEffect(() => {
    onWarningRef.current = onWarning;
    onLogoutRef.current = onLogout;
  }, [onWarning, onLogout]);

  const getLastActivity = () => readTs(LAST_ACTIVITY_KEY) ?? lastActivityMem.current;
  const getSessionStart = () => readTs(SESSION_START_KEY) ?? sessionStartMem.current;

  const markActivity = useCallback(() => {
    const now = Date.now();
    lastActivityMem.current = now;
    writeTs(LAST_ACTIVITY_KEY, now);
    warnedRef.current = false;
  }, []);

  const logout = useCallback(async () => {
    if (loggingOutRef.current) return;
    loggingOutRef.current = true;
    console.log('🔒 Déconnexion automatique');
    clearTs();
    try {
      await signOut();
    } catch (error) {
      // Si l'appel réseau échoue, on supprime quand même la session locale
      console.error('Auto-logout error:', error);
      try {
        await supabase.auth.signOut({ scope: 'local' });
      } catch {
        /* ignore */
      }
    }
    onLogoutRef.current?.();
  }, [signOut]);

  const check = useCallback(() => {
    const now = Date.now();
    const idle = now - getLastActivity();
    const sessionAge = now - getSessionStart();

    if (idle >= INACTIVITY_TIMEOUT || sessionAge >= MAX_SESSION_DURATION) {
      logout();
      return;
    }

    if (idle >= INACTIVITY_TIMEOUT - WARNING_BEFORE_LOGOUT && !warnedRef.current) {
      warnedRef.current = true;
      onWarningRef.current?.();
    }
  }, [logout]);

  useEffect(() => {
    if (!enabled || !userId) return;

    loggingOutRef.current = false;
    warnedRef.current = false;

    // Début de session : on conserve la valeur existante (rechargement, autre onglet)
    const now = Date.now();
    const storedStart = readTs(SESSION_START_KEY);
    if (storedStart === null) {
      sessionStartMem.current = now;
      writeTs(SESSION_START_KEY, now);
    } else {
      sessionStartMem.current = storedStart;
    }

    // Retour sur le site après une longue absence : déconnexion immédiate
    const storedActivity = readTs(LAST_ACTIVITY_KEY);
    if (storedActivity === null) {
      markActivity();
    } else {
      lastActivityMem.current = storedActivity;
    }
    check();

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click', 'wheel'];
    let lastMark = 0;
    const handleActivity = () => {
      const t = Date.now();
      if (t - lastMark > ACTIVITY_THROTTLE) {
        lastMark = t;
        // Ne pas « réveiller » une session déjà expirée
        if (t - getLastActivity() >= INACTIVITY_TIMEOUT) {
          logout();
          return;
        }
        markActivity();
      }
    };

    // Au retour sur l'onglet / sortie de veille : vérifier tout de suite
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') check();
    };

    // Un autre onglet s'est déconnecté : on suit
    const handleStorage = (e: StorageEvent) => {
      if (e.key === LAST_ACTIVITY_KEY && e.newValue === null) check();
    };

    events.forEach((ev) => window.addEventListener(ev, handleActivity, { passive: true }));
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);
    window.addEventListener('storage', handleStorage);
    const interval = window.setInterval(check, CHECK_INTERVAL);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleActivity));
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
      window.removeEventListener('storage', handleStorage);
      window.clearInterval(interval);
    };
    // userId (et non l'objet user) : le rafraîchissement du jeton toutes les heures
    // recrée l'objet user, ce qui remettait les minuteurs à zéro.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, userId]);

  return {
    resetTimer: markActivity,
  };
};
