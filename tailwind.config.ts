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
        paper: { DEFAULT: "#FAF7EF", dim: "#F1ECDF" },
        amber: { DEFAULT: "#E8A33D", dim: "#C9862A" },
        copper: "#B4552B",
        teal: "#3F8564",
        ink: { DEFAULT: "#182430", soft: "#4B5A68" },
        line: { DEFAULT: "#D8D0BD", navy: "rgba(255,255,255,0.14)" },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [typography, forms],
};

export default config;
