import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionTitle from "@/components/ui/SectionTitle";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function ValueProposition() {
  const { ref, isInView } = useScrollAnimation();
  const { t } = useTranslation();

  return (
    <section className="section-padding bg-primary relative overflow-hidden" ref={ref}>
      <div className="absolute top-1/2 right-0 w-32 h-32 -translate-y-1/2 opacity-10 pointer-events-none">
        <svg viewBox="0 0 70 70" fill="none"><circle cx="35" cy="35" r="33" stroke="#7B3FA0" strokeWidth="2" /></svg>
      </div>

      <div className="container-lg">
        <div className="grid lg:grid-cols-[55%_45%] gap-10 lg:gap-16 items-center">
          <div className={`transition-all duration-700 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"}`}>
            <SectionTitle
              label={t("valueProposition.label")}
              title={t("valueProposition.title")}
              align="left"
              light
            />

            <blockquote className="border-l-[3px] border-accent pl-5 my-6">
              <p className="font-display text-xl lg:text-2xl italic text-accent font-medium leading-relaxed">
                &ldquo;{t("valueProposition.quote")}&rdquo;
              </p>
            </blockquote>

            <p className="text-white/80 text-base lg:text-lg leading-relaxed mb-6">
              {t("valueProposition.description")}
            </p>

            <Link to="/a-propos" className="text-link text-accent hover:text-accent-dark">
              {t("valueProposition.cta")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className={`transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"}`}>
            <img
              src="/images/value-proposition.jpg"
              alt={t("valueProposition.imageAlt")}
              className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3] lg:-rotate-1"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
