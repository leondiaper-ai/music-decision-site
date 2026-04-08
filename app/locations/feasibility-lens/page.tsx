"use client";

import { useState, useRef } from "react";
import LocationNav from "@/components/locations/LocationNav";
import LocationHero from "@/components/locations/LocationHero";
import LocationInput from "@/components/locations/LocationInput";
import ResultsTable from "@/components/locations/ResultsTable";
import ResultsSnapshot from "@/components/locations/ResultsSnapshot";
import ExampleOutput from "@/components/locations/ExampleOutput";
import FeasibilitySnapshot from "@/components/locations/FeasibilitySnapshot";
import HowItWorks from "@/components/locations/HowItWorks";
import WhyThisMatters from "@/components/locations/WhyThisMatters";
import CrossDomain from "@/components/locations/CrossDomain";
import LocationFooter from "@/components/locations/LocationFooter";
import InsightCue from "@/components/archive/InsightCue";
import {
  parseRequest,
  evaluate,
  type ParsedRequest,
  type FeasibilityResult,
} from "@/lib/location-engine";

export default function LocationFeasibilityPage() {
  const [result, setResult] = useState<FeasibilityResult | null>(null);
  const [inputText, setInputText] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  function handleSubmit(text: string, parsed: ParsedRequest) {
    setInputText(text);

    // If parsed fields are empty, parse from text
    const finalParsed =
      parsed.locationType && parsed.area
        ? parsed
        : parseRequest(text);

    const output = evaluate(finalParsed);
    setResult(output);

    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  return (
    <main className="overflow-hidden">
      <LocationNav />
      <LocationHero />

      {/* --- THE TOOL --- */}
      <LocationInput onSubmit={handleSubmit} />

      {result && (
        <div ref={resultsRef}>
          <ResultsTable inputText={inputText} options={result.options} />
          <ResultsSnapshot snapshot={result.snapshot} />
          <InsightCue text="The comparison above is the fast output — the layers below show how the system actually thinks." />
        </div>
      )}

      {/* --- CONCEPT SECTIONS (always visible) --- */}
      {!result && (
        <>
          <ExampleOutput />
          <FeasibilitySnapshot />
          <InsightCue text="The comparison above is the fast output — the layers below show how the system actually thinks." />
        </>
      )}

      <HowItWorks />
      <InsightCue text="Each layer feeds the next. Over time, the memory layer makes every subsequent assessment faster and more accurate." />
      <WhyThisMatters />
      <CrossDomain />
      <LocationFooter />
    </main>
  );
}
