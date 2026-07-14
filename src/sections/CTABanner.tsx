import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface CTABannerProps {
  title: string;
  buttonText: string;
  buttonLink: string;
}

export default function CTABanner({ title, buttonText, buttonLink }: CTABannerProps) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section className="bg-secondary py-16 lg:py-20 relative overflow-hidden" ref={ref}>
      {/* Decorative arc */}
      <div className="absolute bottom-0 right-0 w-64 h-32 opacity-10 pointer-events-none">
        <svg viewBox="0 0 580 270" fill="none"><path d="M0 270C0 120.8 120.8 0 270 0h40c149.2 0 270 120.8 270 270H0z" fill="#8B1A1A" /></svg>
      </div>

      <div className="container-md text-center relative z-10">
        <h2 className={`font-display text-2xl lg:text-[36px] font-semibold text-white leading-tight mb-8 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {title}
        </h2>
        <Link
          to={buttonLink}
          className={`btn-secondary inline-flex items-center gap-2 transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {buttonText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
