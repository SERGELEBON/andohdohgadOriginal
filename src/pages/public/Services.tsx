import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import CTABanner from "@/sections/CTABanner";
import { services } from "@/data/services";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useServiceImages, cardImageFor } from "@/hooks/useServiceImages";

function ServiceCard({
  service,
  index,
  isInView,
  imageSrc,
}: {
  service: typeof services[0];
  index: number;
  isInView: boolean;
  imageSrc?: string;
}) {
  const Icon = service.icon;
  return (
    <div
      className={`group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover hover:border-primary/30 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image du service (même image que les cartes de l'accueil, modifiable depuis le dashboard) */}
      <Link
        to={`/services/${service.slug}`}
        className="relative block w-full h-48 sm:h-52 md:h-56 overflow-hidden bg-gray-100"
        aria-label={service.title}
        tabIndex={-1}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={service.title}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="w-10 h-10 text-primary/40" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      <div className="flex flex-col flex-1 p-8 lg:p-10">
        <h3 className="font-display text-xl font-semibold text-dark mb-3">{service.title}</h3>
        <p className="text-body text-sm leading-relaxed mb-5">{service.shortDescription}</p>
        <ul className="space-y-2 mb-6">
          {service.features.slice(0, 3).map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-body">
              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-3">
          <Link to={`/services/${service.slug}`} className="text-link text-sm">
            En savoir plus <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ServicesList() {
  const { ref, isInView } = useScrollAnimation();
  const { images, loading: imagesLoading } = useServiceImages();
  return (
    <section className="section-padding bg-white relative overflow-hidden" ref={ref}>
      <div className="absolute top-10 left-0 w-48 h-48 opacity-[0.04] pointer-events-none"><svg viewBox="0 0 300 260" fill="none"><path d="M150 0L300 260H0L150 0Z" fill="#5C0F8B" /></svg></div>
      <div className="container-lg relative z-10">
        <SectionTitle label="CE QUE NOUS FAISONS" title="Nos domaines d'expertise" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((s, i) => (
            <ServiceCard
              key={s.slug}
              service={s}
              index={i}
              isInView={isInView}
              imageSrc={imagesLoading ? undefined : cardImageFor(s.slug, s.image, images)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  return (
    <>
      <PageHeader
        title="Nos services"
        subtitle="Des solutions complètes et personnalisées pour répondre à tous vos besoins en matière de conseil et d'accompagnement."
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Services", href: "/services" }]}
      />
      <ServicesList />
      <CTABanner title="Un besoin specifique ? Discutons-en ensemble." buttonText="Prendre rendez-vous" buttonLink="/rendez-vous" />
    </>
  );
}
