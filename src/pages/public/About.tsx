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
            <SectionTitle label="NOTRE HISTOIRE" title="Andoh & Dohgad Consulting" align="left" />
            <div className="space-y-4 text-body leading-relaxed">
              <p>Fonde a Abidjan, Andoh & Dohgad Consulting est un cabinet de conseil multidisciplinaire dedie a l&apos;accompagnement des entrepreneurs et des entreprises en Cote d&apos;Ivoire et en Afrique.</p>
              <p>Notre equipe d&apos;experts combine des competences pointues en comptabilite, fiscalite, gestion des ressources humaines, strategie d&apos;entreprise et formation pour offrir des solutions sur mesure a chaque client.</p>
              <p>Nous croyons fermement que la croissance durable d&apos;une entreprise repose sur des fondations solides : une gestion financiere rigoureuse, une strategie claire et des ressources humaines valorisees.</p>
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
        <h2 className={`font-display text-2xl lg:text-[42px] font-bold italic text-white leading-tight transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          &ldquo;Être le partenaire de confiance de chaque entrepreneur africain&rdquo;
        </h2>
        <p className={`text-white/75 text-base lg:text-lg mt-6 max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          Nous aspirons a devenir le cabinet de reference en Afrique de l&apos;Ouest, reconnu pour notre excellence technique, notre proximite avec nos clients et notre contribution au developpement economique du continent.
        </p>
      </div>
    </section>
  );
}

function ValuesGrid() {
  const values = [
    { icon: ShieldCheck, title: "Rigueur", desc: "Nous appliquons les plus hauts standards professionnels dans chaque mission. L&apos;exactitude, la precision et l&apos;exhaustivite sont au cœur de notre demarche." },
    { icon: HeartHandshake, title: "Proximite", desc: "Chaque client est unique. Nous privilegions une relation de confiance personnalisee, basee sur l&apos;ecoute et la disponibilite." },
    { icon: Lightbulb, title: "Innovation", desc: "Nous investissons dans les outils numeriques et les methodologies modernes pour offrir a nos clients des solutions toujours plus performantes." },
    { icon: Lock, title: "Confidentialite", desc: "La protection des donnees et la discretion professionnelle sont des engagements absolus. Vos informations sont en securite avec nous." },
  ];
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="section-padding bg-white" ref={ref}>
      <div className="container-lg">
        <SectionTitle label="NOS VALEURS" title="Ce qui nous guide au quotidien" />
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
    { num: "01", title: "Diagnostic", desc: "Analyse approfondie de votre situation, de vos besoins et de vos objectifs pour identifier les leviers de progres." },
    { num: "02", title: "Strategie", desc: "Elaboration d&apos;un plan d&apos;action personnalise avec des recommandations concretes et des echeanciers clairs." },
    { num: "03", title: "Execution", desc: "Mise en œuvre des solutions avec un accompagnement terrain et un suivi rigoureux des indicateurs de performance." },
    { num: "04", title: "Suivi", desc: "Accompagnement dans la duree, ajustements continus et evaluation reguliere des resultats obtenus." },
  ];
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="section-padding bg-primary-dark" ref={ref}>
      <div className="container-lg">
        <SectionTitle label="NOTRE METHODOLOGIE" title="Un processus structure en 4 etapes" light />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
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
        title="A propos de notre cabinet"
        subtitle="Un partenaire de confiance pour les entrepreneurs africains"
        breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "A propos", href: "/a-propos" }]}
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
