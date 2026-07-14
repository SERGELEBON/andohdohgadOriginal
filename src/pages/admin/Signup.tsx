import PageHeader from '@/components/layout/PageHeader';
import SignupForm from '@/components/auth/SignupForm';

export default function Signup() {
  return (
    <>
      <PageHeader
        title="Inscription"
        subtitle="Créez votre compte pour accéder à nos services"
        breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Inscription', href: '/inscription' }]}
      />
      <section className="section-padding bg-offwhite">
        <div className="container-lg">
          <SignupForm />
        </div>
      </section>
    </>
  );
}
