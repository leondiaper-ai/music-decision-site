import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bold editorial palette — pulled in spirit from POPIN but tuned
        // for a sharper, more product-minded feel.
        cream: "#F6F1E7",
        ink: "#0E0E0E",
        paper: "#FAF7F2",
        signal: "#FF4A1C",   // hot accent — decisions / action
        electric: "#2C25FF", // systems / structure
        mint: "#1FBE7A",     // positive state
        blush: "#FFD3C9",    // soft block
        sun: "#FFD24C",      // highlight
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};
export default config;
