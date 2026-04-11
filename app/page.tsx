import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SystemSection from "@/components/SystemSection";
import HowThisWorks from "@/components/HowThisWorks";
import DecisionExamples from "@/components/DecisionExamples";
import ToolCards from "@/components/ToolCards";
import WhySection from "@/components/WhySection";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";

export default function Page() {
  return (
    <main className="overflow-hidden">
      <Nav />
      <Hero />
      <Marquee />
      <SystemSection />
      <HowThisWorks />
      <DecisionExamples />
      <ToolCards />
      <WhySection />
      <Footer />
    </main>
  );
}
