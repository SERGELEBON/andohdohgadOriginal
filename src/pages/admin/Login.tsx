import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Point d'entrée de l'espace administrateur (/connexion).
 * Aucun lien public n'y mène : la page n'est accessible qu'en saisissant l'URL.
 * Elle est exclue de l'indexation des moteurs de recherche.
 */
export default function Login() {
  const { user, profile, loading, profileLoading } = useAuth();

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow, noarchive';
    document.head.appendChild(meta);

    const previousTitle = document.title;
    document.title = 'Espace administrateur | Andoh & Dohgad';

    return () => {
      meta.remove();
      document.title = previousTitle;
    };
  }, []);

  // Admin déjà connecté : direction le tableau de bord
  if (!loading && !profileLoading && user && profile?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      <PageHeader
        title="Espace administrateur"
        subtitle="Accès réservé à l'équipe Andoh & Dohgad"
        breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Espace administrateur', href: '/connexion' }]}
      />
      <section className="section-padding bg-offwhite">
        <div className="container-lg">
          <LoginForm />
        </div>
      </section>
    </>
  );
}
