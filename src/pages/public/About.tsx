import {
  ShieldCheck, HeartHandshake, Lightbulb, Lock,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import SectionTitle from "@/components/ui/SectionTitle";
import CTABanner from "@/sections/CTABanner";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { team } from "@/data/team";

function FirmPresentation() {
  const { ref, isInView } = useScrollAnimation();
  return (
    <section className="section-padding bg-white" ref={ref}>
      <div className="container-lg">
        <div className="grid lg:grid-cols-[55%_45%] gap-10 lg:gap-16 items-center">
          <div className={`transition-all duration-700 ${isInView ? "opacity-100 -translate-x-0" : "opacity-0 -translate-x-16"}`}>
            <SectionTitle label="QUI SOMMES-NOUS" title="Un cabinet qui possède déjà la donnée de ses clients" align="left" />
            <div className="space-y-4 text-body leading-relaxed">
              <p>Cabinet de conseil en structuration organisationnelle et pilotage de la performance, basé à Abidjan (Plateau — AfricaWorks). Co-dirigé en co-direction, avec une équipe dédiée à chaque mission.</p>
              <p>Nous rendons votre entreprise bancable, agile et prête à conquérir l&apos;avenir en réunissant 4 expertises dédiées — comptable, fiscale, RH et structuration — dans une seule méthode et, pour les clients qui le souhaitent, dans une offre intégrée : <strong>Synergia</strong>.</p>
              <div className="bg-offwhite rounded-xl p-6 border-l-4 border-primary">
                <p className="font-display text-lg font-semibold text-dark italic">&ldquo;Faire parler les chiffres pour éclairer chaque décision du dirigeant — et transformer une entreprise dépendante des personnes en une organisation pilotée par des processus.&rdquo;</p>
                <p className="text-sm text-primary font-semibold mt-3 uppercase tracking-wider">Notre promesse</p>
              </div>
            </div>
          </div>
          <div className={`transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}>
            <img src="/images/about-team.jpg" alt="L'equipe Andoh & Dohgad Consulting" className="rounded-xl shadow-card-hover w-full object-cover aspect-[4/3]" />
          </div>
        </div>
      </div>
    </section>
  );
}

function VisionSection() {
  const { ref, isInView } = useScrollAnimation();
  return (
    <section className="section-padding bg-primary relative overflow-hidden" ref={ref}>
      <div className="container-md text-center relative z-10">
        <span className="text-xs font-semibold uppercase tracking-[2px] text-accent mb-4 block">NOTRE VISION</span>
        <h2 className={`font-display text-2xl lg:text-[42px] font-bold text-white leading-tight transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          &ldquo;Transformer une entreprise dépendante des personnes en une organisation pilotée par des processus, des responsabilités claires et des mécanismes de contrôle favorisant une croissance durable.&rdquo;
        </h2>
        <div className={`grid md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto transition-all duration-700 delay-300 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="text-left">
            <p className="text-accent font-bold text-sm mb-2">Le dirigeant au centre</p>
            <p className="text-white/75 text-sm">Le système sert sa vision, jamais l&apos;inverse.</p>
          </div>
          <div className="text-left">
            <p className="text-accent font-bold text-sm mb-2">Les processus priment</p>
            <p className="text-white/75 text-sm">Sur les habitudes individuelles.</p>
          </div>
          <div className="text-left">
            <p className="text-accent font-bold text-sm mb-2">L&apos;amélioration continue</p>
            <p className="text-white/75 text-sm">Est permanente, jamais ponctuelle.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValuesGrid() {
  const values = [
    { icon: Lock, title: "Confidentialité", desc: "Vos données et vos enjeux stratégiques restent strictement protégés." },
    { icon: HeartHandshake, title: "Démarche collaborative", desc: "Chaque livrable est coconstruit et validé avec votre direction." },
    { icon: ShieldCheck, title: "Orientée résultats", desc: "Des recommandations mesurables, reliées à vos indicateurs de pilotage." },
    { icon: Lightbulb, title: "Meilleures pratiques", desc: "Gouvernance, contrôle interne et structuration éprouvés." },
  ];
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="section-padding bg-white" ref={ref}>
      <div className="container-lg">
        <SectionTitle label="NOS ENGAGEMENTS" title="Les principes qui gouvernent chaque mission" />
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className={`bg-offwhite rounded-xl p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-card ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <Icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-body text-lg font-semibold text-dark mb-2">{v.title}</h3>
                <p className="text-body text-sm leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MethodologySteps() {
  const steps = [
    { num: "01", title: "Diagnostic Flash", desc: "Premier aperçu chiffré de la maturité de votre entreprise." },
    { num: "02", title: "Cadrage ARCHE", desc: "Compréhension approfondie de votre organisation et de vos enjeux." },
    { num: "03", title: "Diagnostic & Orientations", desc: "Forces, risques et priorités hiérarchisées pour agir." },
    { num: "04", title: "Mise en musique", desc: "Organigramme, procédures et fiches de poste structurés." },
    { num: "05", title: "Pilotage & Croissance", desc: "Indicateurs de décision en continu pour piloter la croissance." },
  ];
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="section-padding bg-primary-dark" ref={ref}>
      <div className="container-lg">
        <SectionTitle label="L'EXPÉRIENCE CLIENT" title="Le Parcours Client en 5 étapes" light />
        <p className="text-white/75 text-center max-w-2xl mx-auto mb-12">Du premier contact au pilotage récurrent — un cycle continu, pas une mission ponctuelle.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative">
          {steps.map((step, i) => (
            <div key={step.num} className={`text-center relative transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="w-14 h-14 rounded-full border-2 border-accent flex items-center justify-center mx-auto mb-4">
                <span className="text-accent font-display font-bold text-lg">{step.num}</span>
              </div>
              <h3 className="font-body text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-white/65 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamGrid() {
  const { ref, isInView } = useScrollAnimation();
  return (
    <section className="section-padding bg-offwhite" ref={ref}>
      <div className="container-lg">
        <SectionTitle label="NOTRE EQUIPE" title="Les experts derriere votre succes" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <div key={member.name} className={`bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-1 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: `${i * 120}ms` }}>
              <div className="aspect-[3/4] overflow-hidden">
                <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h4 className="font-body text-lg font-semibold text-dark">{member.name}</h4>
                <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                <p className="text-body text-sm leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <>
      <PageHeader
        title="Transformer le conseil en un véritable levier de croissance"
        subtitle="Andoh & Dohgad Consulting est le partenaire stratégique des PME et professions libérales, dès les premiers pas de leur entreprise."
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "À propos", href: "/a-propos" }]}
      />
      <FirmPresentation />
      <VisionSection />
      <ValuesGrid />
      <MethodologySteps />
      <TeamGrid />
      <CTABanner title="Envie de nous rencontrer et de discuter de vos projets ?" buttonText="Prendre rendez-vous" buttonLink="/rendez-vous" />
    </>
  );
}
