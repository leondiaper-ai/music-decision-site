import Nav from "@/components/Nav";
import NorthStar from "@/components/NorthStar";
import Hero from "@/components/Hero";
import RealDecision from "@/components/RealDecision";
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
      <NorthStar />
      <Hero />
      <Marquee />
      <RealDecision />
      <SystemSection />
      <HowThisWorks />
      <DecisionExamples />
      <ToolCards />
      <WhySection />
      <Footer />
    </main>
  );
}
