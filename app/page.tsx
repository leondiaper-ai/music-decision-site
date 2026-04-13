import Nav from "@/components/Nav";
import NorthStar from "@/components/NorthStar";
import NorthStarSystem from "@/components/NorthStarSystem";
import Hero from "@/components/Hero";
import DecisionExamples from "@/components/DecisionExamples";
import ToolCards from "@/components/ToolCards";
import WhySection from "@/components/WhySection";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main className="overflow-hidden">
      <Nav />
      <NorthStar />
      <Hero />
      <NorthStarSystem />
      <DecisionExamples />
      <ToolCards />
      <WhySection />
      <Footer />
    </main>
  );
}
