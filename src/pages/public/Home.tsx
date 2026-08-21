import HeroSection from "@/sections/HeroSection";
import StatsBar from "@/sections/StatsBar";
import ServicesGrid from "@/sections/ServicesGrid";
import ValueProposition from "@/sections/ValueProposition";
import Testimonials from "@/sections/Testimonials";
import BlogPreview from "@/sections/BlogPreview";
import CTABanner from "@/sections/CTABanner";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ServicesGrid />
      <ValueProposition />
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
