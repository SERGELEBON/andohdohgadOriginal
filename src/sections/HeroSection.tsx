import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import ParticleCanvas from "@/components/ui/ParticleCanvas";

export default function HeroSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.4
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9 },
          0.6
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7 },
          1.0
        )
        .fromTo(
          buttonsRef.current?.children || [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          1.3
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] lg:min-h-screen flex items-center justify-center overflow-hidden -mt-[70px] lg:-mt-[80px]"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/images/hero-background.jpg)" }}
      />

      {/* Violet overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(135deg, rgba(61,10,94,0.65) 0%, rgba(92,15,139,0.60) 50%, rgba(61,10,94,0.70) 100%)",
        }}
      />

      {/* Particle canvas */}
      <ParticleCanvas />

      {/* Content */}
      <div className="relative z-[3] container-sm text-center px-4 pt-20 pb-16">
        <span
          ref={labelRef}
          className="inline-block text-xs font-semibold uppercase tracking-[3px] text-accent mb-6 opacity-0"
        >
          {t('hero.label')}
        </span>

        <h1
          ref={titleRef}
          className="font-display text-3xl sm:text-4xl lg:text-[52px] font-bold text-white leading-[1.15] opacity-0"
        >
          {t('hero.title')}
        </h1>

        <p
          ref={subtitleRef}
          className="text-white/85 text-base lg:text-lg mt-6 max-w-xl mx-auto leading-relaxed opacity-0"
        >
          {t('hero.subtitle')}
        </p>

        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Link to="/services" className="btn-primary opacity-0">
            {t('hero.cta1')}
          </Link>
          <Link
            to="/rendez-vous"
            className="btn-secondary opacity-0 inline-flex items-center gap-2"
          >
            {t('hero.cta2')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
