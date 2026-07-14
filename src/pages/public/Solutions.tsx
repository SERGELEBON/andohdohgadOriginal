import { Check } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import CTABanner from "@/sections/CTABanner";
import { solutions } from "@/data/solutions";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

function SolutionsGrid() {
  const { ref, isInView } = useScrollAnimation();
  return (
    <section className="section-padding bg-white" ref={ref}>
      <div className="container-lg">
        <SectionTitle label="SOLUTIONS NUMERIQUES" title="Des outils pour digitaliser votre gestion" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {solutions.map((sol, i) => {
            const Icon = sol.icon;
            return (
              <div key={sol.title} className={`bg-white border border-gray-200 rounded-2xl p-8 lg:p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-card-hover ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sol.status === "Disponible" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {sol.status === "Bientot" ? "Bientôt" : sol.status}
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-dark mb-3">{sol.title}</h3>
                <p className="text-body text-sm leading-relaxed mb-5">{sol.description}</p>
                <ul className="space-y-2">
                  {sol.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-body">
                      <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ERPTeaser() {
  const { ref, isInView } = useScrollAnimation();
  return (
    <section className="section-padding bg-offwhite" ref={ref}>
      <div className="container-lg">
        <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #5C0F8B 0%, #3D0A5E 100%)" }}>
          <div className="grid lg:grid-cols-[60%_40%] gap-8 items-center">
            <div className={`p-8 lg:p-12 transition-all duration-700 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
              <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full mb-4 uppercase tracking-wider">Projet en developpement</span>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mb-4">ERP Andoh & Dohgad — Bientot disponible</h3>
              <p className="text-white/80 text-sm lg:text-base leading-relaxed mb-6">
                Nous developpons un ERP complet integre comptabilite, paie, RH, gestion commerciale et reporting. Une solution 100% adaptee aux realites des entreprises africaines.
              </p>
              <p className="text-accent font-medium text-sm mb-6">Comptabilite &middot; Paie &middot; RH &middot; Gestion commerciale &middot; Reporting</p>
              <button className="btn-outline text-sm">Etre informe du lancement</button>
            </div>
            <div className={`p-6 lg:p-8 transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
              <img src="/images/erp-mockup.jpg" alt="ERP Dashboard" className="rounded-xl shadow-2xl w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SolutionsPage() {
  return (
    <>
      <PageHeader
        title="Nos solutions numeriques"
        subtitle="Des outils technologiques innovants pour moderniser la gestion de votre entreprise."
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Solutions", href: "/solutions" }]}
      />
      <SolutionsGrid />
      <ERPTeaser />
      <CTABanner title="Vous souhaitez moderniser la gestion de votre entreprise ?" buttonText="Nous contacter" buttonLink="/contact" />
    </>
  );
}
