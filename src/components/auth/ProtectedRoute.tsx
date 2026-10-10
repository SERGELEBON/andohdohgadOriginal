import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string | string[];
  redirectTo?: string;
}

/**
 * Garde de route côté client.
 * - Refus par défaut : si un rôle est exigé et que le profil n'est pas chargé
 *   ou ne correspond pas, l'accès est refusé.
 * - Ce contrôle est uniquement ergonomique : la vraie protection des données
 *   est assurée par les politiques RLS de Supabase.
 */
export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/connexion'
}: ProtectedRouteProps) {
  const { user, profile, loading, profileLoading } = useAuth();
  const location = useLocation();

  if (loading || (user && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Chargement">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles) {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!profile || !rolesArray.includes(profile.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
