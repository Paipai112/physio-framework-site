import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0A0A0A",
          elevated: "#121212",
          highlight: "#1A1A1A",
          hover: "#242424",
        },
        border: {
          subtle: "#1F1F1F",
          DEFAULT: "#2A2A2A",
          strong: "#333333",
        },
        text: {
          primary: "#FAFAFA",
          secondary: "#A3A3A3",
          muted: "#737373",
        },
        layer: {
          "1": "#FF5757",
          "2": "#FFB347",
          "3": "#4ADE80",
          "4": "#60A5FA",
          "5": "#C084FC",
        },
      },
      fontFamily: {
        heading: ["Space Grotesk", "Noto Sans SC", "sans-serif"],
        body: ["DM Sans", "Noto Sans SC", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 8px 30px rgba(0, 0, 0, 0.5)",
        modal: "0 20px 60px rgba(0, 0, 0, 0.6)",
        glow: "0 0 20px var(--tw-shadow-color)",
      },
      animation: {
        "fade-in": "fadeIn 300ms ease-out",
        "slide-up": "slideUp 300ms ease-out",
        "slide-down": "slideDown 200ms ease-out",
        "scale-in": "scaleIn 200ms ease-out",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      borderRadius: {
        card: "16px",
        button: "12px",
        modal: "20px",
      },
      maxWidth: {
        "content": "72rem",
        "prose": "65ch",
      },
    },
  },
  plugins: [],
};

export default config;
