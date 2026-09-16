import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#F8FAF6", dim: "#EDF2E9" },
        amber: { DEFAULT: "#D9F279", dim: "#48704A" },
        copper: "#37694D",
        teal: "#367957",
        ink: { DEFAULT: "#16392F", soft: "#5E7067" },
        line: { DEFAULT: "#DCE4DA", navy: "rgba(255,255,255,0.14)" },
      },
      fontFamily: {
        serif: ["Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [typography, forms],
};

export default config;
