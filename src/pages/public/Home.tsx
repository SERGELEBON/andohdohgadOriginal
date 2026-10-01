import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, X } from "lucide-react";
import HeroSection from "@/sections/HeroSection";
import StatsBar from "@/sections/StatsBar";
import ServicesGrid from "@/sections/ServicesGrid";
import ValueProposition from "@/sections/ValueProposition";
import WhyChooseUs from "@/sections/WhyChooseUs";
import Testimonials from "@/sections/Testimonials";
import BlogPreview from "@/sections/BlogPreview";
import CTABanner from "@/sections/CTABanner";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  useEffect(() => {
    if (searchParams.get('session_expired') === 'true') {
      setShowSessionExpired(true);
      // Remove query param
      searchParams.delete('session_expired');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <>
      {/* Session expired notification */}
      {showSessionExpired && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg shadow-lg p-4 max-w-md flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 text-sm mb-1">Session expirée</h3>
              <p className="text-amber-800 text-xs">
                Vous avez été déconnecté automatiquement pour des raisons de sécurité (inactivité ou durée maximale).
              </p>
            </div>
            <button
              onClick={() => setShowSessionExpired(false)}
              className="text-amber-600 hover:text-amber-800 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <HeroSection />
      <StatsBar />
      <ServicesGrid />
      <ValueProposition />
      <WhyChooseUs />
      <Testimonials />
      <BlogPreview />
      <CTABanner
        title={"Prêt à structurer votre entreprise et accélérer votre croissance ?"}
        buttonText={"Nous contacter"}
        buttonLink="/contact"
      />
    </>
  );
}
