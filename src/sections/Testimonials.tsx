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
        <SectionTitle 
          label={"ILS NOUS FONT CONFIANCE"} 
          title={"Ce que nos clients disent de nous"} 
        />

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-smooth"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {testimonials.map((testimonial, i) => (
                <div key={i} className="w-full shrink-0 px-0 md:px-12">
                  <div className={`bg-white rounded-2xl p-8 lg:p-10 shadow-card max-w-3xl mx-auto transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${i * 150}ms` }}>
                    <Quote className="w-10 h-10 text-accent mb-4" />
                    <p className="font-display text-lg lg:text-xl italic text-dark leading-relaxed mb-6">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-dark">{testimonial.author}</p>
                        <p className="text-sm text-body">{testimonial.role}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: testimonial.rating }).map((_, j) => (
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
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-primary hover:text-primary-dark transition-all"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === active ? "bg-primary w-8" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Aller au témoignage ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-primary hover:text-primary-dark transition-all"
              aria-label="Suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
