import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useCMSContent } from "@/hooks/useCMSContent";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const { ref, isInView } = useScrollAnimation();
  const { content, loading } = useCMSContent("hero");

  useEffect(() => {
    if (!heroRef.current || !isInView || loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-label", { opacity: 0, y: -20, duration: 0.6 })
        .from(".hero-title", { opacity: 0, y: 30, duration: 0.8, stagger: 0.1 }, "-=0.3")
        .from(".hero-subtitle", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
        .from(".hero-cta", { opacity: 0, y: 15, duration: 0.5, stagger: 0.15 }, "-=0.3");
    }, heroRef);

    return () => ctx.revert();
  }, [isInView, loading]);

  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </section>
    );
  }

  const data = content?.content || {};
  const bgImage = content?.images?.background || "/images/hero-bg.jpg";

  return (
    <section ref={heroRef} className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(61,10,94,0.65) 0%, rgba(92,15,139,0.60) 50%, rgba(61,10,94,0.70) 100%)",
        }}
      />

      <div className="container-xl relative z-10 text-white py-20" ref={ref}>
        <div className="max-w-3xl">
          <span className="hero-label inline-block px-4 py-1.5 bg-accent/20 backdrop-blur-sm text-accent text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            {data.label || "Cabinet de Conseil"}
          </span>

          <h1 className="hero-title font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {data.title || "Passer de la survie à la croissance"}
          </h1>

          <p className="hero-subtitle text-lg lg:text-xl text-white/90 leading-relaxed mb-10 max-w-2xl">
            {data.subtitle || ""}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/services" className="hero-cta btn-primary inline-flex items-center justify-center gap-2">
              {data.cta1 || "Découvrir nos services"}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/rendez-vous" className="hero-cta btn-outline inline-flex items-center justify-center gap-2 border-white/80 text-white hover:bg-white/10">
              {data.cta2 || "Prendre rendez-vous"}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
