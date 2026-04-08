import ArchiveNav from "@/components/archive/ArchiveNav";
import ArchiveHero from "@/components/archive/ArchiveHero";
import ThemeSummary from "@/components/archive/ThemeSummary";
import PatternReveal from "@/components/archive/PatternReveal";
import EmergingInsight from "@/components/archive/EmergingInsight";
import InsightCue from "@/components/archive/InsightCue";
import FeaturedInvestigations from "@/components/archive/FeaturedInvestigations";
import ArchiveStructure from "@/components/archive/ArchiveStructure";
import InvestigationList from "@/components/archive/InvestigationList";
import FutureLayer from "@/components/archive/FutureLayer";
import ArchiveFooter from "@/components/archive/ArchiveFooter";

export const metadata = {
  title: "ARCH — British State Power: Ireland / Northern Ireland",
  description:
    "An archive intelligence page mapping British state power, partition, military presence, and political strategy in Ireland and Northern Ireland.",
};

export default function ArchivePage() {
  return (
    <main className="overflow-hidden">
      <ArchiveNav />
      <ArchiveHero />
      <ThemeSummary />
      <PatternReveal />
      <EmergingInsight />
      <InsightCue text="These patterns point toward a system that adapts its form but not its intent — the following investigations trace that in detail." />
      <FeaturedInvestigations />
      <ArchiveStructure />
      <InsightCue text="Together, these suggest a single strategy operating across political and military domains — restructured, not removed." />
      <InvestigationList />
      <FutureLayer />
      <ArchiveFooter />
    </main>
  );
}
