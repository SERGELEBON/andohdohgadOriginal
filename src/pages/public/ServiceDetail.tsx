import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Check, Phone } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { services } from "@/data/services";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const service = services.find((s) => s.slug === slug);
  const { ref, isInView } = useScrollAnimation();

  useEffect(() => {
    if (!service) navigate("/services");
  }, [service, navigate]);

  if (!service) return null;

  const Icon = service.icon;
  const otherServices = services.filter((s) => s.slug !== slug);

  return (
    <>
      <PageHeader
        title={service.title}
        subtitle={service.shortDescription}
        breadcrumbs={[
          { label: "Accueil", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title, href: `#` },
        ]}
      />

      <section className="section-padding bg-white" ref={ref}>
        <div className="container-lg">
          <div className="grid lg:grid-cols-[65%_35%] gap-10 lg:gap-16">
            {/* Main content */}
            <div className={`transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-primary" />
              </div>

              <p className="text-body text-base lg:text-lg leading-relaxed mb-8">
                {service.fullDescription}
              </p>

              <h3 className="font-display text-xl font-semibold text-dark mb-4">
                Problematiques que nous adressons
              </h3>
              <ul className="space-y-3 mb-8">
                {service.problematics.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-body">{p}</span>
                  </li>
                ))}
              </ul>

              <h3 className="font-display text-xl font-semibold text-dark mb-4">
                Notre valeur ajoutee
              </h3>
              <p className="text-body leading-relaxed mb-8">
                {service.valueProposition}
              </p>

              <h3 className="font-display text-xl font-semibold text-dark mb-6">
                Notre processus
              </h3>
              <div className="space-y-4">
                {service.process.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-display font-bold text-sm shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-dark">{step.title}</h4>
                      <p className="text-body text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className={`space-y-6 transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
              {/* CTA Card */}
              <div className="bg-primary rounded-xl p-8 text-white">
                <h4 className="font-body text-lg font-semibold mb-2">Besoin de ce service ?</h4>
                <p className="text-white/75 text-sm mb-6">Contactez-nous pour discuter de votre projet.</p>
                <Link to="/rendez-vous" className="btn-secondary w-full text-center block mb-3 text-sm">
                  Prendre rendez-vous
                </Link>
                <Link to="/contact" className="btn-outline w-full text-center block text-sm">
                  Demander une information
                </Link>
              </div>

              {/* Related services */}
              <div className="bg-offwhite rounded-xl p-6">
                <h4 className="font-body font-semibold text-dark mb-4">Autres services</h4>
                <ul className="space-y-2.5">
                  {otherServices.map((s) => {
                    const SIcon = s.icon;
                    return (
                      <li key={s.slug}>
                        <Link to={`/services/${s.slug}`} className="flex items-center gap-3 text-sm text-body hover:text-primary transition-colors py-1">
                          <SIcon className="w-4 h-4 shrink-0" />
                          <span>{s.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Quick contact */}
              <div className="bg-offwhite rounded-xl p-6">
                <h4 className="font-body font-semibold text-dark mb-3">Contact rapide</h4>
                <div className="flex items-center gap-2 text-sm text-body mb-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+225 07 09 57 75 30</span>
                </div>
                <p className="text-xs text-muted-foreground mt-3">Disponible du lundi au vendredi, 8h-17h</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
