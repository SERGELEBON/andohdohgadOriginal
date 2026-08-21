import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import ParticleCanvas from "@/components/ui/ParticleCanvas";
import { useCMSContent } from "@/hooks/useCMSContent";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  
  const { content, loading } = useCMSContent("hero");

  useEffect(() => {
    if (loading) return;

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
  }, [loading]);

  // Valeurs par défaut si CMS pas chargé
  const data = content?.content || {
    label: "Cabinet de Conseil Multidisciplinaire",
    title: "Passer de la survie à la croissance",
    subtitle: "Andoh & Dohgad Consulting accompagne les entrepreneurs ivoiriens dans la structuration, la gestion et la croissance de leurs entreprises.",
    cta1: "Découvrir nos services",
    cta2: "Prendre rendez-vous"
  };
  
  const bgImage = content?.images?.background || "/images/hero-background.jpg";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] lg:min-h-screen flex items-center justify-center overflow-hidden -mt-[70px] lg:-mt-[80px]"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
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
          {data.label}
        </span>

        <h1
          ref={titleRef}
          className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-[1.15] opacity-0"
        >
          {data.title}
        </h1>

        <p
          ref={subtitleRef}
          className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed opacity-0"
        >
          {data.subtitle}
        </p>

        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/services"
            className="btn-primary inline-flex items-center gap-2 opacity-0"
          >
            {data.cta1}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/rendez-vous"
            className="btn-outline inline-flex items-center gap-2 border-white/80 text-white hover:bg-white/10 opacity-0"
          >
            {data.cta2}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
