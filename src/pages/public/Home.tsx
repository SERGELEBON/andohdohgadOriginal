import { useTranslation } from "react-i18next";
import HeroSection from "@/sections/HeroSection";
import StatsBar from "@/sections/StatsBar";
import ServicesGrid from "@/sections/ServicesGrid";
import ValueProposition from "@/sections/ValueProposition";
import Testimonials from "@/sections/Testimonials";
import BlogPreview from "@/sections/BlogPreview";
import CTABanner from "@/sections/CTABanner";

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <HeroSection />
      <StatsBar />
      <ServicesGrid />
      <ValueProposition />
      <Testimonials />
      <BlogPreview />
      <CTABanner
        title={t('home.ctaTitle')}
        buttonText={t('home.ctaButton')}
        buttonLink="/contact"
      />
    </>
  );
}
