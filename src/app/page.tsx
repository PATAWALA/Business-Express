import { HeroSection } from "@/components/sections/HeroSection";
import { StatsBar } from "@/components/sections/StatsBar";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ShippingRoutes } from "@/components/sections/ShippingRoutes";
import { DubaiCatalog } from "@/components/sections/DubaiCatalog";
import { CalculatorDevis } from "@/components/sections/CalculatorDevis";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTAWhatsAppModal } from "@/components/sections/CTAWhatsAppModal";

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