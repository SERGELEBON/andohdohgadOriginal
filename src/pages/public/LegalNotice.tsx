import PageHeader from "@/components/layout/PageHeader";

export default function LegalNotice() {
  return (
    <>
      <PageHeader
        title="Mentions légales"
        subtitle="Informations légales concernant Andoh & Dohgad Consulting"
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Mentions légales", href: "/mentions-legales" },
        ]}
      />

      <section className="section-padding bg-white">
        <div className="container-lg max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-display text-2xl font-semibold text-dark mb-4">Éditeur du site</h2>
            <p className="text-body mb-6">
              <strong>Andoh & Dohgad Consulting</strong><br />
              Cabinet de conseil multidisciplinaire<br />
              Siège social : AfricaWorks, Plateau Rue du Commerce, Abidjan, Côte d'Ivoire<br />
              Email : andoh.dohgad@gmail.com<br />
              Téléphone : +225 07 09 57 75 30 / +225 07 09 20 46 62
            </p>

            <h2 className="font-display text-2xl font-semibold text-dark mb-4 mt-8">Directeur de la publication</h2>
            <p className="text-body mb-6">
              Les co-dirigeants d'Andoh & Dohgad Consulting
            </p>

            <h2 className="font-display text-2xl font-semibold text-dark mb-4 mt-8">Hébergement</h2>
            <p className="text-body mb-6">
              Ce site est hébergé par Vercel Inc.<br />
              340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br />
              Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vercel.com</a>
            </p>

            <h2 className="font-display text-2xl font-semibold text-dark mb-4 mt-8">Propriété intellectuelle</h2>
            <p className="text-body mb-6">
              L'ensemble de ce site relève de la législation ivoirienne et internationale sur le droit d'auteur et la propriété intellectuelle.
              Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
            <p className="text-body mb-6">
              La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite
              sauf autorisation expresse d'Andoh & Dohgad Consulting.
            </p>

            <h2 className="font-display text-2xl font-semibold text-dark mb-4 mt-8">Données personnelles</h2>
            <p className="text-body mb-6">
              Conformément à la loi ivoirienne relative à la protection des données personnelles, vous disposez d'un droit d'accès,
              de rectification et de suppression des données vous concernant.
            </p>
            <p className="text-body mb-6">
              Pour exercer ce droit, veuillez nous contacter à : andoh.dohgad@gmail.com
            </p>

            <h2 className="font-display text-2xl font-semibold text-dark mb-4 mt-8">Cookies</h2>
            <p className="text-body mb-6">
              Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. Aucune donnée personnelle n'est collectée
              sans votre consentement explicite via nos formulaires de contact.
            </p>

            <h2 className="font-display text-2xl font-semibold text-dark mb-4 mt-8">Limitation de responsabilité</h2>
            <p className="text-body mb-6">
              Andoh & Dohgad Consulting s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site.
              Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
            </p>
            <p className="text-body mb-6">
              En conséquence, nous déclinons toute responsabilité pour toute imprécision, inexactitude ou omission portant sur
              des informations disponibles sur ce site.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
