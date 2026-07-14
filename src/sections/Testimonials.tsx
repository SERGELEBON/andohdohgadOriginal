import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import SectionTitle from "@/components/ui/SectionTitle";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const { ref, isInView } = useScrollAnimation();

  const prev = () => setActive((a) => (a === 0 ? testimonials.length - 1 : a - 1));
  const next = () => setActive((a) => (a === testimonials.length - 1 ? 0 : a + 1));

  return (
    <section className="section-padding bg-offwhite" ref={ref}>
      <div className="container-lg">
        <SectionTitle label="TEMOIGNAGES" title="Ce que nos clients disent de nous" />

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-smooth"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="w-full shrink-0 px-0 md:px-12">
                  <div className={`bg-white rounded-2xl p-8 lg:p-10 shadow-card max-w-3xl mx-auto transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${i * 150}ms` }}>
                    <Quote className="w-10 h-10 text-accent mb-4" />
                    <p className="font-display text-lg lg:text-xl italic text-dark leading-relaxed mb-6">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-dark">{t.author}</p>
                        <p className="text-sm text-body">{t.role}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 text-primary">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === active ? "bg-primary w-6" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
            <button onClick={next} className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 text-primary">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
