import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import CTABanner from "@/sections/CTABanner";
import { services } from "@/data/services";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

function ServiceCard({ service, index, isInView }: { service: typeof services[0]; index: number; isInView: boolean }) {
  const Icon = service.icon;
  return (
    <div className={`group bg-white border border-gray-200 rounded-2xl p-8 lg:p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover hover:border-primary/30 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: `${index * 100}ms` }}>
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
        <Icon className="w-9 h-9 text-primary" />
      </div>
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
      <div className="flex flex-wrap gap-3">
        <Link to={`/services/${service.slug}`} className="text-link text-sm">
          En savoir plus <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

function ServicesList() {
  const { ref, isInView } = useScrollAnimation();
  return (
    <section className="section-padding bg-white relative overflow-hidden" ref={ref}>
      <div className="absolute top-10 left-0 w-48 h-48 opacity-[0.04] pointer-events-none"><svg viewBox="0 0 300 260" fill="none"><path d="M150 0L300 260H0L150 0Z" fill="#5C0F8B" /></svg></div>
      <div className="container-lg relative z-10">
        <SectionTitle label="CE QUE NOUS FAISONS" title="Nos domaines d&apos;expertise" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((s, i) => <ServiceCard key={s.slug} service={s} index={i} isInView={isInView} />)}
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
        subtitle="Des solutions completes et personnalisees pour repondre a tous vos besoins en matiere de conseil et d&apos;accompagnement."
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Services", href: "/services" }]}
      />
      <ServicesList />
      <CTABanner title="Un besoin specifique ? Discutons-en ensemble." buttonText="Prendre rendez-vous" buttonLink="/rendez-vous" />
    </>
  );
}
