import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Send } from "lucide-react";
import { services } from "@/data/services";
import SectionTitle from "@/components/ui/SectionTitle";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function ServicesGrid() {
  const { ref, isInView } = useScrollAnimation();
  const navigate = useNavigate();
  return (
    <section className="section-padding bg-white relative overflow-hidden" ref={ref}>
      {/* Decorative shapes */}
      <div className="absolute top-10 left-0 w-48 h-48 opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 300 260" fill="none"><path d="M150 0L300 260H0L150 0Z" fill="#5C0F8B" /></svg>
      </div>
      <div className="absolute bottom-10 right-0 w-48 h-48 opacity-[0.04] pointer-events-none rotate-180">
        <svg viewBox="0 0 300 260" fill="none"><path d="M150 0L300 260H0L150 0Z" fill="#5C0F8B" /></svg>
      </div>

      <div className="container-lg relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <SectionTitle
            label={"NOS SERVICES"}
            title={"Un accompagnement complet pour votre entreprise"}
          />
          <button
            onClick={() => navigate('/demande-service')}
            className="btn-primary inline-flex items-center gap-2 self-start lg:self-auto bg-accent hover:bg-accent/90 text-dark font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <Send className="w-5 h-5" />
            {"Demander un service"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, i) => {
            return (
              <div
                key={service.slug}
                className={`group bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover hover:border-primary/30 ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Service Image */}
                {service.image && (
                  <div className="relative w-full h-48 sm:h-52 md:h-56 overflow-hidden bg-gray-100">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}

                {/* Service Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-dark mb-3 line-clamp-2">
                    {service.title}
                  </h3>
                  <p className="text-body text-sm leading-relaxed mb-5 line-clamp-3">
                    {service.shortDescription}
                  </p>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-link group/link"
                  >
                    {"En savoir plus"}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
