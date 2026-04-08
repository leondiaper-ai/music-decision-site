"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ParsedRequest } from "@/lib/location-engine";

interface LocationInputProps {
  onSubmit: (input: string, parsed: ParsedRequest) => void;
}

const LOCATION_TYPES = ["Street", "Cobbled street", "Park", "Rooftop", "Warehouse", "Waterfront", "Interior"];
const AREAS = ["Central", "East", "South", "North", "West"];
const SHOOT_SIZES = ["Small", "Medium", "Large"];
const TIMES = ["Daytime", "Night", "Dawn/dusk"];

export default function LocationInput({ onSubmit }: LocationInputProps) {
  const [mode, setMode] = useState<"text" | "structured">("text");
  const [textInput, setTextInput] = useState("");

  // Structured fields
  const [locationType, setLocationType] = useState("Street");
  const [area, setArea] = useState("Central");
  const [shootSize, setShootSize] = useState("Small");
  const [time, setTime] = useState("Daytime");

  function handleTextSubmit() {
    if (!textInput.trim()) return;
    // We'll parse on the parent side via the engine
    onSubmit(textInput.trim(), {
      locationType: "",
      area: "",
      shootSize: "",
      time: "",
    });
  }

  function handleStructuredSubmit() {
    const sentence = `I need a ${locationType.toLowerCase()} in ${area.toLowerCase()} London for a ${shootSize.toLowerCase()} ${time.toLowerCase()} shoot.`;
    const parsed: ParsedRequest = {
      locationType: locationType.toLowerCase(),
      area: area.toLowerCase(),
      shootSize: shootSize.toLowerCase(),
      time: time.toLowerCase(),
    };
    onSubmit(sentence, parsed);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  }

  return (
    <section className="relative py-20 md:py-28 bg-cream">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 mb-10">
          <div className="md:col-span-5">
            <span className="eyebrow text-ink/60">Try it</span>
            <h2 className="headline font-display text-4xl md:text-5xl mt-3">
              Describe your
              <br />
              <span className="italic font-light">location need.</span>
            </h2>
          </div>
          <div className="md:col-span-7 md:pl-8 flex items-end">
            <p className="text-base text-ink/65 leading-relaxed max-w-lg">
              Type a natural request or use the structured fields. The system
              will parse your intent, score London areas, and return ranked
              options.
            </p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-1 mb-6">
          <button
            onClick={() => setMode("text")}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              mode === "text"
                ? "bg-ink text-paper"
                : "bg-paper border border-ink/10 text-ink/60 hover:text-ink"
            }`}
          >
            Freetext
          </button>
          <button
            onClick={() => setMode("structured")}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              mode === "structured"
                ? "bg-ink text-paper"
                : "bg-paper border border-ink/10 text-ink/60 hover:text-ink"
            }`}
          >
            Structured
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === "text" ? (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="border border-ink/10 rounded-2xl bg-paper p-6 md:p-8"
            >
              <div className="flex flex-col gap-4">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. I need a cobbled street in central London for a small daytime shoot"
                  rows={3}
                  className="w-full bg-transparent text-lg text-ink placeholder:text-ink/30 leading-relaxed resize-none focus:outline-none font-display"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink/30">
                    Press Enter or click Generate
                  </span>
                  <button
                    onClick={handleTextSubmit}
                    disabled={!textInput.trim()}
                    className="px-6 py-2.5 bg-ink text-paper text-sm font-semibold rounded-full hover:bg-ink/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Generate options
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="structured"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="border border-ink/10 rounded-2xl bg-paper p-6 md:p-8"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
                <FieldSelect
                  label="Location type"
                  value={locationType}
                  options={LOCATION_TYPES}
                  onChange={setLocationType}
                />
                <FieldSelect
                  label="Area"
                  value={area}
                  options={AREAS}
                  onChange={setArea}
                />
                <FieldSelect
                  label="Shoot size"
                  value={shootSize}
                  options={SHOOT_SIZES}
                  onChange={setShootSize}
                />
                <FieldSelect
                  label="Time of day"
                  value={time}
                  options={TIMES}
                  onChange={setTime}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink/40 italic">
                  &ldquo;{locationType.toLowerCase()} · {area.toLowerCase()} ·{" "}
                  {shootSize.toLowerCase()} · {time.toLowerCase()}&rdquo;
                </p>
                <button
                  onClick={handleStructuredSubmit}
                  className="px-6 py-2.5 bg-ink text-paper text-sm font-semibold rounded-full hover:bg-ink/90 transition-colors"
                >
                  Generate options
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function FieldSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="eyebrow text-ink/50 mb-2 block">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-cream/50 border border-ink/10 rounded-lg px-3 py-2.5 text-sm font-medium text-ink focus:outline-none focus:border-ink/30 appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
