// ─────────────────────────────────────────────
// Location Feasibility Engine — V1 (hardcoded)
// ─────────────────────────────────────────────

// --- Types ---

export interface ParsedRequest {
  locationType: string;   // e.g. "cobbled street", "park", "rooftop"
  area: string;           // e.g. "central", "east", "south"
  shootSize: string;      // "small" | "medium" | "large"
  time: string;           // "daytime" | "night" | "dawn/dusk"
}

export interface EvidenceLine {
  label: string;       // e.g. "Permit requirement", "Lead time basis"
  fact: string;        // The actual grounding statement
  source: string;      // Where this comes from
}

export interface AreaData {
  name: string;
  detail: string;
  tags: string[];
  paperwork: 1 | 2 | 3;           // 1=light, 2=moderate, 3=heavy
  baseLeadWeeks: [number, number]; // [min, max]
  baseRisk: 1 | 2 | 3 | 4 | 5;
  baseCostLow: number;
  baseCostHigh: number;
  filmFriendly: boolean;
  notes: string;
  evidence: EvidenceLine[];        // Grounding facts per area
  confidence: "High" | "Medium" | "Low";
  unknowns: string[];              // What we don't know
}

export interface ScoredOption {
  area: string;
  detail: string;
  leadTime: string;
  cost: string;
  paperwork: "Light" | "Moderate" | "Heavy";
  riskLevel: number;
  score: number;
  verdict: string;
  verdictNote: string;
  evidence: EvidenceLine[];
  confidence: "High" | "Medium" | "Low";
  unknowns: string[];
}

export interface FeasibilityResult {
  parsed: ParsedRequest;
  options: ScoredOption[];
  snapshot: {
    scenarioType: string;
    scenarioDetail: string;
    paperworkLoad: string;
    paperworkDetail: string;
    exposure: string;
    exposureDetail: string;
    authorityComplexity: string;
    authorityDetail: string;
    tags: string[];
    recommendation: string;
    confidence: "High" | "Medium" | "Low";
    confidenceNote: string;
    unknowns: string[];
  };
}

// --- Dataset ---

const AREAS: AreaData[] = [
  {
    name: "Westminster",
    detail: "Great Smith St area",
    tags: ["heritage", "central", "security", "tourist"],
    paperwork: 3,
    baseLeadWeeks: [6, 8],
    baseRisk: 4,
    baseCostLow: 2800,
    baseCostHigh: 4200,
    filmFriendly: false,
    notes: "Heritage + security zone. Multiple authority layers.",
    evidence: [
      { label: "Permit authority", fact: "Westminster City Council requires a Temporary Activity Notice plus separate highways licence for any street filming.", source: "Westminster filming policy" },
      { label: "Security zone", fact: "Parts of Westminster fall within the Parliamentary Security Zone — additional Met Police liaison required for any crew over 5.", source: "Met Police filming guidance" },
      { label: "Heritage restriction", fact: "Great Smith St is within a conservation area. No temporary structures or surface fixings without conservation officer sign-off.", source: "Westminster conservation area map" },
    ],
    confidence: "High",
    unknowns: ["Exact fee schedule changes annually", "Security zone boundaries may shift during parliamentary sessions"],
  },
  {
    name: "Camden",
    detail: "Elm Village / Agar Grove",
    tags: ["residential", "central", "mixed-use"],
    paperwork: 2,
    baseLeadWeeks: [3, 4],
    baseRisk: 2,
    baseCostLow: 1200,
    baseCostHigh: 1800,
    filmFriendly: true,
    notes: "Residential sensitivity. Council generally cooperative.",
    evidence: [
      { label: "Film office", fact: "Camden operates a dedicated film office that processes location requests. Standard turnaround is 15–20 working days.", source: "Camden Film Office" },
      { label: "Resident notification", fact: "Any shoot within 50m of residential properties requires 7-day advance letterbox notification to affected households.", source: "Camden filming code of practice" },
      { label: "Parking suspension", fact: "Bay suspensions for crew vehicles require separate application to Camden Parking — minimum 10 working days notice.", source: "Camden parking services" },
    ],
    confidence: "High",
    unknowns: ["Resident complaint history for specific streets not publicly available"],
  },
  {
    name: "Islington",
    detail: "Sekforde St / Clerkenwell",
    tags: ["heritage", "central", "film-friendly", "quiet-streets"],
    paperwork: 1,
    baseLeadWeeks: [2, 3],
    baseRisk: 1,
    baseCostLow: 900,
    baseCostHigh: 1400,
    filmFriendly: true,
    notes: "Film-friendly borough. Established precedent for street shoots.",
    evidence: [
      { label: "Film-friendly status", fact: "Islington Council actively promotes filming and has a streamlined single-application process for small crews (under 10).", source: "Islington film service" },
      { label: "Precedent", fact: "Sekforde Street and surrounding Clerkenwell streets have hosted 30+ permitted shoots in the past 24 months.", source: "Islington filming register" },
      { label: "Lead time", fact: "Standard permit turnaround is 10 working days. Expedited processing available for 50% surcharge.", source: "Islington film service" },
    ],
    confidence: "High",
    unknowns: ["Expedited processing availability depends on current council workload"],
  },
  {
    name: "Southwark",
    detail: "Bermondsey St / Tanner St",
    tags: ["warehouse", "cobbled", "south", "mixed-use"],
    paperwork: 1,
    baseLeadWeeks: [2, 3],
    baseRisk: 2,
    baseCostLow: 800,
    baseCostHigh: 1300,
    filmFriendly: true,
    notes: "Good cobbled streets. Some private land complicates access.",
    evidence: [
      { label: "Surface type", fact: "Bermondsey Street retains original Victorian cobblestones for approximately 200m between Tanner St and Leathermarket St.", source: "Southwark heritage survey" },
      { label: "Mixed ownership", fact: "Some cobbled sections near Tanner St are privately maintained by the Bermondsey Estate — separate access agreement needed.", source: "Land Registry / local knowledge" },
      { label: "Film office", fact: "Southwark Film Office offers a single permit for council-owned streets. Typical turnaround 10–15 working days.", source: "Southwark film service" },
    ],
    confidence: "Medium",
    unknowns: ["Private land boundaries not precisely mapped", "Estate management contact may have changed recently"],
  },
  {
    name: "City of London",
    detail: "Cloth Fair / Bartholomew Close",
    tags: ["heritage", "central", "corporate", "security"],
    paperwork: 3,
    baseLeadWeeks: [5, 7],
    baseRisk: 3,
    baseCostLow: 2200,
    baseCostHigh: 3800,
    filmFriendly: false,
    notes: "Separate authority from GLA. Corporate area, strict hours.",
    evidence: [
      { label: "Separate authority", fact: "The City of London Corporation operates independently from the GLA. Filming permits go through the City's own Highways department, not a borough film office.", source: "City of London Corporation" },
      { label: "Hours restriction", fact: "Filming on City streets is typically restricted to weekends and bank holidays. Weekday permits require additional justification and higher fees.", source: "City filming guidelines" },
      { label: "Heritage grade", fact: "Cloth Fair contains Grade II* listed buildings. Any equipment contact with facades, railings, or street furniture requires Listed Building Consent.", source: "Historic England listing" },
    ],
    confidence: "High",
    unknowns: ["Weekend access may conflict with events at Smithfield Market", "City Police may impose additional conditions beyond standard permit"],
  },
];

// --- Parser ---

const LOCATION_KEYWORDS: Record<string, string[]> = {
  "cobbled street": ["cobble", "cobbled", "cobblestone", "stone street", "mews"],
  "park": ["park", "garden", "green space", "field", "meadow"],
  "rooftop": ["rooftop", "roof", "terrace", "balcony", "skyline"],
  "street": ["street", "road", "lane", "alley", "pavement", "sidewalk"],
  "warehouse": ["warehouse", "industrial", "factory", "depot"],
  "interior": ["interior", "inside", "indoor", "building", "room"],
  "waterfront": ["river", "canal", "waterfront", "embankment", "dock"],
};

const AREA_KEYWORDS: Record<string, string[]> = {
  central: ["central", "zone 1", "west end", "soho", "westminster", "city", "covent garden", "mayfair"],
  east: ["east", "shoreditch", "hackney", "bethnal green", "stratford", "bow"],
  south: ["south", "southwark", "bermondsey", "brixton", "peckham", "lambeth"],
  north: ["north", "camden", "islington", "kentish town", "highgate", "holloway"],
  west: ["west", "notting hill", "hammersmith", "kensington", "chelsea", "fulham"],
};

const SIZE_KEYWORDS: Record<string, string[]> = {
  small: ["small", "tiny", "minimal", "skeleton", "lean", "2-3", "couple"],
  medium: ["medium", "mid", "moderate", "standard", "regular"],
  large: ["large", "big", "full", "major", "extensive", "crew of 20", "crew of 30"],
};

const TIME_KEYWORDS: Record<string, string[]> = {
  daytime: ["day", "daytime", "morning", "afternoon", "midday", "lunch"],
  night: ["night", "overnight", "evening", "late", "after dark", "midnight"],
  "dawn/dusk": ["dawn", "dusk", "sunrise", "sunset", "golden hour", "magic hour"],
};

function matchKeywords(input: string, map: Record<string, string[]>): string {
  const lower = input.toLowerCase();
  let bestMatch = "";
  let bestScore = 0;
  for (const [key, keywords] of Object.entries(map)) {
    for (const kw of keywords) {
      if (lower.includes(kw) && kw.length > bestScore) {
        bestMatch = key;
        bestScore = kw.length;
      }
    }
  }
  return bestMatch;
}

export function parseRequest(input: string): ParsedRequest {
  return {
    locationType: matchKeywords(input, LOCATION_KEYWORDS) || "street",
    area: matchKeywords(input, AREA_KEYWORDS) || "central",
    shootSize: matchKeywords(input, SIZE_KEYWORDS) || "small",
    time: matchKeywords(input, TIME_KEYWORDS) || "daytime",
  };
}

// --- Scoring ---

function scoreArea(area: AreaData, req: ParsedRequest): number {
  // Lower is better. We invert at the end.
  let penalty = 0;

  // Paperwork: 1=0, 2=15, 3=35
  penalty += [0, 0, 15, 35][area.paperwork];

  // Risk: each point = 8 penalty
  penalty += area.baseRisk * 8;

  // Lead time: avg weeks * 5
  const avgLead = (area.baseLeadWeeks[0] + area.baseLeadWeeks[1]) / 2;
  penalty += avgLead * 5;

  // Bonuses / adjustments based on request
  if (area.filmFriendly) penalty -= 10;

  // Night shoots add risk for residential areas
  if (req.time === "night" && area.tags.includes("residential")) {
    penalty += 15;
  }

  // Large crews add paperwork pain
  if (req.shootSize === "large") {
    penalty += area.paperwork * 8;
  }

  // Heritage locations are worse for large shoots
  if (req.shootSize === "large" && area.tags.includes("heritage")) {
    penalty += 10;
  }

  // Cobbled street preference
  if (req.locationType === "cobbled street" && area.tags.includes("cobbled")) {
    penalty -= 8;
  }

  // Central preference when requested
  if (req.area === "central" && area.tags.includes("central")) {
    penalty -= 5;
  }

  // South preference
  if (req.area === "south" && area.tags.includes("south")) {
    penalty -= 10;
  }

  return 100 - penalty; // higher = better
}

function adjustLeadTime(base: [number, number], req: ParsedRequest): [number, number] {
  let [min, max] = base;
  if (req.shootSize === "large") { min += 1; max += 2; }
  if (req.time === "night") { min += 1; max += 1; }
  return [min, max];
}

function adjustCost(low: number, high: number, req: ParsedRequest): [number, number] {
  let mult = 1.0;
  if (req.shootSize === "medium") mult = 1.4;
  if (req.shootSize === "large") mult = 2.0;
  if (req.time === "night") mult *= 1.3;
  return [Math.round(low * mult / 100) * 100, Math.round(high * mult / 100) * 100];
}

function adjustRisk(base: number, req: ParsedRequest): number {
  let r = base;
  if (req.time === "night") r = Math.min(5, r + 1);
  if (req.shootSize === "large") r = Math.min(5, r + 1);
  return r;
}

const PAPERWORK_LABELS: Record<number, "Light" | "Moderate" | "Heavy"> = {
  1: "Light",
  2: "Moderate",
  3: "Heavy",
};

const VERDICT_LABELS = ["Best path", "Workable", "High friction"] as const;

// --- Confidence & unknowns ---

function deriveConfidence(top3: { confidence: string; score: number }[]): "High" | "Medium" | "Low" {
  const levels = top3.map((o) => o.confidence);
  if (levels[0] === "High" && levels[1] !== "Low") return "High";
  if (levels.includes("Low")) return "Low";
  return "Medium";
}

function deriveConfidenceNote(
  top3: { confidence: string; area: string }[],
  req: ParsedRequest
): string {
  const bestConf = top3[0].confidence;
  if (bestConf === "High") {
    return `Good data coverage for ${top3[0].area}. Permit process and lead times are well-documented.`;
  }
  if (bestConf === "Low") {
    return `Limited verified data for ${top3[0].area}. Treat estimates as rough guidance — direct council contact recommended.`;
  }
  return `Reasonable data for ${top3[0].area} but some gaps remain. Verify private land boundaries and current fee schedules before committing.`;
}

function deriveUnknowns(
  top3: { unknowns: string[]; area: string }[],
  req: ParsedRequest
): string[] {
  // Collect unknowns from top pick + add request-specific gaps
  const unknowns = [...top3[0].unknowns];

  if (req.time === "night") {
    unknowns.push("Exact noise curfew hours vary by borough and may not be published");
  }
  if (req.shootSize === "large") {
    unknowns.push("Traffic management plan costs are quote-based and not included in estimates");
  }
  // Always flag this — it's honest
  unknowns.push("All cost estimates are based on typical ranges — actual council fees should be confirmed directly");

  return unknowns;
}

// --- Evidence builder ---

function buildEvidence(area: AreaData, req: ParsedRequest): EvidenceLine[] {
  // Start with the area's base evidence
  const lines = [...area.evidence];

  // Add contextual evidence based on the request
  if (req.time === "night" && area.tags.includes("residential")) {
    lines.push({
      label: "Night restriction",
      fact: `Night shoots near residential areas in ${area.name} typically require noise management plans and may be limited to pre-midnight hours.`,
      source: "Standard borough noise policy",
    });
  }
  if (req.shootSize === "large") {
    lines.push({
      label: "Large crew impact",
      fact: `Crews over 15 in ${area.name} may trigger additional traffic management requirements and higher permit fees.`,
      source: "Borough highways guidance",
    });
  }

  return lines;
}

// --- Main ---

export function evaluate(req: ParsedRequest): FeasibilityResult {
  // Score all areas
  const scored = AREAS.map((area) => {
    const score = scoreArea(area, req);
    const [leadMin, leadMax] = adjustLeadTime(area.baseLeadWeeks, req);
    const [costLow, costHigh] = adjustCost(area.baseCostLow, area.baseCostHigh, req);
    const risk = adjustRisk(area.baseRisk, req);

    return {
      area: area.name,
      detail: area.detail,
      leadTime: `${leadMin}–${leadMax} weeks`,
      cost: `£${costLow.toLocaleString()}–${costHigh.toLocaleString()}`,
      paperwork: PAPERWORK_LABELS[area.paperwork],
      riskLevel: risk,
      score,
      verdict: "",
      verdictNote: area.notes,
      evidence: buildEvidence(area, req),
      confidence: area.confidence,
      unknowns: area.unknowns,
      _tags: area.tags,
      _filmFriendly: area.filmFriendly,
    };
  });

  // Sort by score descending, take top 3
  scored.sort((a, b) => b.score - a.score);
  const top3 = scored.slice(0, 3);

  // Assign verdicts
  top3[0].verdict = VERDICT_LABELS[0];
  top3[1].verdict = VERDICT_LABELS[1];
  top3[2].verdict = VERDICT_LABELS[2];

  const options: ScoredOption[] = top3.map(({ _tags, _filmFriendly, ...rest }) => rest as ScoredOption);

  // Build snapshot from the best option and overall request
  const best = top3[0];
  const worstPaperwork = Math.max(...top3.map((o) => ({ Light: 1, Moderate: 2, Heavy: 3 }[o.paperwork])));

  const scenarioTypes: Record<string, string> = {
    "cobbled street": "Public highway, heritage surface",
    street: "Public highway",
    park: "Public open space",
    rooftop: "Private building access",
    warehouse: "Private / commercial premises",
    interior: "Private interior",
    waterfront: "Public highway / embankment",
  };

  const exposureLevels: Record<string, [string, string]> = {
    daytime: ["Medium exposure", "Daytime mitigates noise risk"],
    night: ["High exposure", "Night work adds resident / noise constraints"],
    "dawn/dusk": ["Low–medium exposure", "Early/late hours reduce public conflict"],
  };

  const paperworkDescriptions: Record<number, [string, string]> = {
    1: ["Light", "Straightforward process across options"],
    2: ["Moderate", "Some variation by borough"],
    3: ["Moderate to heavy", "Varies significantly by borough"],
  };

  const [expValue, expDetail] = exposureLevels[req.time] || exposureLevels.daytime;
  const [pwValue, pwDetail] = paperworkDescriptions[worstPaperwork] || paperworkDescriptions[2];

  const authorityCount = top3[0].riskLevel <= 2 ? "1–2" : "1–3";

  const snapshot = {
    scenarioType: scenarioTypes[req.locationType] || "Public highway",
    scenarioDetail: req.locationType.charAt(0).toUpperCase() + req.locationType.slice(1),
    paperworkLoad: pwValue,
    paperworkDetail: pwDetail,
    exposure: expValue,
    exposureDetail: expDetail,
    authorityComplexity: `${authorityCount} bodies likely`,
    authorityDetail: "Council + possible TfL",
    tags: [
      req.time.charAt(0).toUpperCase() + req.time.slice(1),
      req.locationType.charAt(0).toUpperCase() + req.locationType.slice(1),
      req.area.charAt(0).toUpperCase() + req.area.slice(1),
    ],
    recommendation: `Start with ${best.area} (${best.detail}). ${best.verdictNote} Hold ${top3[1].area} as fallback.`,
    confidence: deriveConfidence(top3),
    confidenceNote: deriveConfidenceNote(top3, req),
    unknowns: deriveUnknowns(top3, req),
  };

  return { parsed: req, options, snapshot };
}

// Convenience: parse + evaluate in one call
export function run(input: string): FeasibilityResult {
  return evaluate(parseRequest(input));
}
