import PageHeader from "@/components/layout/PageHeader";

export default function PrivacyPolicy() {
  return (
    <>
      <PageHeader
        title="Politique de confidentialité"
        subtitle="Comment nous collectons et protégeons vos données personnelles"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Politique de confidentialité", href: "/politique-confidentialite" },
        ]}
      />

      <section className="section-padding bg-white">
        <div className="container-lg max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-body mb-6">
              <em>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</em>
            </p>

            <h2 className="font-display text-2xl font-semibold text-dark mb-4 mt-8">1. Collecte des données</h2>
            <p className="text-body mb-4">
              Nous collectons des données personnelles uniquement lorsque vous nous les transmettez volontairement via nos formulaires :
            </p>
            <ul className="list-disc list-inside text-body mb-6 space-y-2">
              <li>Formulaire de contact</li>
              <li>Formulaire de prise de rendez-vous</li>
              <li>Formulaire d'inscription au co-working</li>
              <li>Formulaires de sondages</li>
              <li>Téléchargement de documents</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-dark mb-4 mt-8">2. Données collectées</h2>
            <p className="text-body mb-4">
              Les données que nous collectons peuvent inclure :
            </p>
            <ul className="list-disc list-inside text-body mb-6 space-y-2">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Nom de l'entreprise</li>
              <li>Informations relatives à votre demande ou besoin</li>
            </ul>

            <h2 className="font-display text-2xl font-semibold text-dark mb-4 mt-8">3. Utilisation des données</h2>
            <p className="text-body mb-4">
              Vos données personnelles sont utilisées exclusivement pour :
            </p>
            <ul className="list-disc list-inside text-body mb-6 space-y-2">
              <li>Répondre à vos demandes de contact ou de rendez-vous</li>
              <li>Vous fournir les services demandés</li>
              <li>Améliorer la qualité de nos services</li>
              <li>Vous informer de nos actualités (uniquement si vous y avez consenti)</li>
            </ul>
            <p className="text-body mb-6">
              <strong>Nous ne vendons, ne louons ni ne partageons vos données personnelles avec des tiers à des fins commerciales.</strong>
            </p>

            <h2 className="font-display text-2xl font-semibold text-dark mb-4 mt-8">4. Durée de conservation</h2>
            <p className="text-body mb-6">
              Vos données sont conservées pendant la durée nécessaire à la gestion de votre demande,
              puis archivées conformément aux obligations légales en vigueur en Côte d'Ivoire.
            </p>

            <h2 className="font-display text-2xl font-semibold text-dark mb-4 mt-8">5. Sécurité des données</h2>
            <p className="text-body mb-6">
              Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger vos données
              contre tout accès non autorisé, modification, divulgation ou destruction.
            </p>
            <p className="text-body mb-6">
              Les données sont stockées de manière sécurisée sur des serveurs protégés et ne sont accessibles
              qu'aux membres habilités de notre équipe.
            </p>

            <h2 className="font-display text-2xl font-semibold text-dark mb-4 mt-8">6. Vos droits</h2>
            <p className="text-body mb-4">
              Conformément à la législation ivoirienne sur la protection des données, vous disposez des droits suivants :
            </p>
            <ul className="list-disc list-inside text-body mb-6 space-y-2">
              <li><strong>Droit d'accès</strong> : obtenir la confirmation que vos données sont traitées et y accéder</li>
              <li><strong>Droit de rectification</strong> : corriger des données inexactes ou incomplètes</li>
              <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
              <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
              <li><strong>Droit à la portabilité</strong> : récupérer vos données dans un format structuré</li>
            </ul>
            <p className="text-body mb-6">
              Pour exercer ces droits, contactez-nous à : <a href="mailto:andoh.dohgad@gmail.com" className="text-primary hover:underline">andoh.dohgad@gmail.com</a>
            </p>

            <h2 className="font-display text-2xl font-semibold text-dark mb-4 mt-8">7. Cookies</h2>
            <p className="text-body mb-6">
              Notre site utilise uniquement des cookies techniques essentiels au fonctionnement du site.
              Aucun cookie de tracking ou publicitaire n'est utilisé sans votre consentement préalable.
            </p>

            <h2 className="font-display text-2xl font-semibold text-dark mb-4 mt-8">8. Modifications</h2>
            <p className="text-body mb-6">
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.
              Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour.
            </p>

            <h2 className="font-display text-2xl font-semibold text-dark mb-4 mt-8">9. Contact</h2>
            <p className="text-body mb-6">
              Pour toute question concernant cette politique de confidentialité ou le traitement de vos données personnelles,
              vous pouvez nous contacter :
            </p>
            <p className="text-body mb-6">
              <strong>Andoh & Dohgad Consulting</strong><br />
              Email : <a href="mailto:andoh.dohgad@gmail.com" className="text-primary hover:underline">andoh.dohgad@gmail.com</a><br />
              Téléphone : +225 07 09 57 75 30<br />
              Adresse : AfricaWorks, Plateau Rue du Commerce, Abidjan, Côte d'Ivoire
            </p>
          </div>
        </div>
      </section>
    </>
  );
}