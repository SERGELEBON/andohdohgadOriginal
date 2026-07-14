import { useRef, useEffect, useState } from "react";
import CountUp from "react-countup";
import { useInView } from "framer-motion";

const stats = [
  { value: 200, suffix: "+", label: "Clients accompagnés" },
  { value: 7, suffix: "", label: "Expertises métiers" },
  { value: 10, suffix: "", label: "Années d'expérience" },
];

export default function StatsBar() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView) setHasAnimated(true);
  }, [isInView]);

  return (
    <section ref={ref} className="bg-primary-dark py-16 lg:py-20">
      <div className="container-lg">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-5xl lg:text-6xl font-bold text-accent leading-tight">
                {hasAnimated ? (
                  <CountUp
                    end={stat.value}
                    duration={2}
                    suffix={stat.suffix}
                    delay={i * 0.2}
                  />
                ) : (
                  <span>0{stat.suffix}</span>
                )}
              </div>
              <p className="text-white/70 text-sm lg:text-base mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
