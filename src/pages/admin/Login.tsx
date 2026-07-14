import PageHeader from '@/components/layout/PageHeader';
import LoginForm from '@/components/auth/LoginForm';

export default function Login() {
  return (
    <>
      <PageHeader
        title="Connexion"
        subtitle="Connectez-vous à votre compte Andoh & Dohgad"
        breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Connexion', href: '/connexion' }]}
      />
      <section className="section-padding bg-offwhite">
        <div className="container-lg">
          <LoginForm />
        </div>
      </section>
    </>
  );
}
