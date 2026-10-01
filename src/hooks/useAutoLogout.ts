import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Auto logout hook - Best practices for security
 *
 * - Déconnexion après 30 minutes d'inactivité
 * - Déconnexion après 24h de session (même si actif)
 * - Détection d'activité: mouse, keyboard, touch, scroll
 * - Warning 2 minutes avant déconnexion
 */

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const MAX_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 heures
const WARNING_BEFORE_LOGOUT = 2 * 60 * 1000; // 2 minutes avant

interface UseAutoLogoutOptions {
  enabled?: boolean;
  onWarning?: () => void;
  onLogout?: () => void;
}

export const useAutoLogout = (options: UseAutoLogoutOptions = {}) => {
  const { enabled = true, onWarning, onLogout } = options;
  const { user, signOut } = useAuth();

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartRef = useRef<number>(Date.now());
  const maxSessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(async () => {
    console.log('🔒 Auto-logout triggered');
    try {
      await signOut();
      onLogout?.();
    } catch (error) {
      console.error('Auto-logout error:', error);
    }
  }, [signOut, onLogout]);

  const resetInactivityTimer = useCallback(() => {
    // Clear existing timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }

    // Check if max session duration exceeded
    const sessionDuration = Date.now() - sessionStartRef.current;
    if (sessionDuration >= MAX_SESSION_DURATION) {
      console.log('⏱️ Max session duration exceeded');
      logout();
      return;
    }

    // Set warning timer (2 minutes before logout)
    warningTimerRef.current = setTimeout(() => {
      console.log('⚠️ Warning: Session will expire in 2 minutes');
      onWarning?.();
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE_LOGOUT);

    // Set logout timer
    inactivityTimerRef.current = setTimeout(() => {
      console.log('⏱️ Inactivity timeout reached');
      logout();
    }, INACTIVITY_TIMEOUT);
  }, [logout, onWarning]);

  useEffect(() => {
    if (!enabled || !user) {
      return;
    }

    // Reset session start time
    sessionStartRef.current = Date.now();

    // Set max session timer (24h)
    maxSessionTimerRef.current = setTimeout(() => {
      console.log('⏱️ Max session duration (24h) reached');
      logout();
    }, MAX_SESSION_DURATION);

    // Activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // Debounce activity detection (max 1 reset per 5 seconds)
    let lastReset = 0;
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastReset > 5000) {
        lastReset = now;
        resetInactivityTimer();
      }
    };

    // Initialize timer
    resetInactivityTimer();

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
      if (maxSessionTimerRef.current) {
        clearTimeout(maxSessionTimerRef.current);
      }
    };
  }, [enabled, user, resetInactivityTimer, logout]);

  return {
    resetTimer: resetInactivityTimer,
  };
};
