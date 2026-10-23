import { HeroSection } from "@/components/public/sections/HeroSection";
import { StatsBar } from "@/components/public/sections/StatsBar";
import { ServicesGrid } from "@/components/public/sections/ServicesGrid";
import { ShippingRoutes } from "@/components/public/sections/ShippingRoutes";
import { DubaiCatalog } from "@/components/public/sections/DubaiCatalog";
import { CalculatorDevis } from "@/components/public/sections/CalculatorDevis";
import { Testimonials } from "@/components/public/sections/Testimonials";
import { CTAWhatsAppModal } from "@/components/public/sections/CTAWhatsAppModal";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ServicesGrid />
      <ShippingRoutes />
      <DubaiCatalog />
      <CalculatorDevis />
      <Testimonials />
      <CTAWhatsAppModal />
    </>
  );
}