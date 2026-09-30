import { CheckCircle, Target, Shield, Zap, Users, TrendingUp } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const reasons = [
  {
    icon: Target,
    title: "Expertise pointue",
    description: "Une équipe pluridisciplinaire maîtrisant comptabilité, fiscalité, RH et structuration — 4 expertises en une seule mission.",
  },
  {
    icon: Shield,
    title: "Connaissance du terrain",
    description: "Nous possédons déjà la donnée comptable, fiscale et RH de nos clients — nous partons toujours avec un temps d'avance.",
  },
  {
    icon: Zap,
    title: "Méthodologie éprouvée",
    description: "La méthode A&D ARCHE™ transforme l'analyse en décisions concrètes, mesurables et actionnables pour votre croissance.",
  },
  {
    icon: Users,
    title: "Accompagnement personnalisé",
    description: "Chaque mission est co-construite avec vous. Pas de solution générique, uniquement du sur-mesure adapté à vos enjeux.",
  },
  {
    icon: TrendingUp,
    title: "Résultats mesurables",
    description: "Des recommandations reliées à vos indicateurs de pilotage réels. Nous mesurons l'impact de chaque action mise en place.",
  },
  {
    icon: CheckCircle,
    title: "Conformité garantie",
    description: "De la création à la croissance, nous sécurisons votre conformité fiscale, sociale et réglementaire à chaque étape.",
  },
];

export default function WhyChooseUs() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="section-padding bg-gradient-to-br from-primary-dark via-primary to-primary-dark relative overflow-hidden" ref={ref}>
      {/* Logo background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
        <img
          src="/images/logo.png"
          alt=""
          className="w-full h-full max-w-4xl object-contain"
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container-lg relative z-10">
        <SectionTitle
          label="NOTRE DIFFÉRENCE"
          title="Pourquoi choisir Andoh & Dohgad Consulting ?"
          light
        />
        <p className="text-white/75 text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          Nous ne sommes pas un cabinet de conseil comme les autres. Notre avantage : nous possédons déjà vos données
          et transformons cette connaissance en un accompagnement sur-mesure, du diagnostic à la croissance.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <div
                key={i}
                className={`group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 lg:p-8 transition-all duration-500 hover:-translate-y-1 hover:bg-white/10 hover:border-accent/50 ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-body text-lg font-semibold text-white mb-2">
                  {reason.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-white/60 text-sm mb-4">
            Prêt à transformer votre entreprise ?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/rendez-vous"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              Prendre rendez-vous
            </a>
            <a
              href="/a-propos"
              className="btn-outline inline-flex items-center justify-center gap-2 border-white/30 text-white hover:bg-white/10"
            >
              En savoir plus
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}