import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function ValueProposition() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="section-padding bg-primary relative overflow-hidden" ref={ref}>
      <div className="absolute top-1/2 right-0 w-32 h-32 -translate-y-1/2 opacity-10 pointer-events-none">
        <svg viewBox="0 0 70 70" fill="none"><circle cx="35" cy="35" r="33" stroke="#7B3FA0" strokeWidth="2" /></svg>
      </div>

      <div className="container-lg">
        <div className="grid lg:grid-cols-[55%_45%] gap-10 lg:gap-16 items-center">
          <div className={`transition-all duration-700 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}`}>
            <SectionTitle
              label="NOTRE PHILOSOPHIE"
              title="La clarté financière permet de transformer les opportunités en décisions maîtrisées"
              align="left"
              light
            />

            <blockquote className="border-l-[3px] border-accent pl-5 my-6">
              <p className="font-display text-xl lg:text-2xl italic text-accent font-medium leading-relaxed">
                &ldquo;Grandir sans visibilité est un risque.&rdquo;
              </p>
            </blockquote>

            <p className="text-white/80 text-base lg:text-lg leading-relaxed mb-6">
              Chez Andoh & Dohgad Consulting, nous croyons que chaque entrepreneur mérite
              une vision claire de sa situation financière et stratégique. Notre mission
              est de vous offrir les outils et l&apos;expertise nécessaires pour passer de
              la simple survie à une croissance maîtrisée et durable.
            </p>

            <Link to="/a-propos" className="text-link text-accent hover:text-accent-dark">
              Découvrir notre approche
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className={`transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}>
            <img
              src="/images/value-proposition.jpg"
              alt="Professionnelle analysant des données financières"
              className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3] lg:-rotate-1"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
