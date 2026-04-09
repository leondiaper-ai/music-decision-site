import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SystemSection from "@/components/SystemSection";
import DecisionExamples from "@/components/DecisionExamples";
import ToolCards from "@/components/ToolCards";
import ExampleInPractice from "@/components/ExampleInPractice";
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
      <DecisionExamples />
      <ToolCards />
      <ExampleInPractice />
      <WhySection />
      <Footer />
    </main>
  );
}
