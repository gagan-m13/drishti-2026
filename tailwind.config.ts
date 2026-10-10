import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        durgi: {
          dark: "#080B11",
          card: "#0E131F",
          cardHover: "#151D2E",
          navy: "#0A1128",
          border: "#252E42",
          gold: {
            DEFAULT: "#D4AF37",
            light: "#F7E7A9",
            dark: "#997D24",
            accent: "#E5C158",
            muted: "#A28738",
          },
          crimson: {
            DEFAULT: "#9B111E",
            dark: "#680A13",
            light: "#C81D25",
          },
          saffron: "#FF9933",
        },
      },
      fontFamily: {
        serif: ["Cinzel", "Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        festive: ["Cinzel Decorative", "Cinzel", "Georgia", "serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F7E7A9 0%, #D4AF37 50%, #997D24 100%)",
        "gold-gradient-subtle": "linear-gradient(135deg, rgba(247,231,169,0.15) 0%, rgba(212,175,55,0.08) 50%, rgba(153,125,36,0.02) 100%)",
        "dark-radial": "radial-gradient(circle at 50% 30%, #151D30 0%, #080B11 80%)",
        "crimson-glow": "radial-gradient(circle at center, rgba(155,17,30,0.25) 0%, rgba(8,11,17,0) 70%)",
      },
      boxShadow: {
        "gold-glow": "0 0 25px -5px rgba(212, 175, 55, 0.3)",
        "gold-glow-lg": "0 0 50px -10px rgba(212, 175, 55, 0.4)",
        "gold-glow-sm": "0 0 15px -3px rgba(212, 175, 55, 0.2)",
        "crimson-glow": "0 0 30px -5px rgba(155, 17, 30, 0.4)",
      },
      animation: {
        "gold-shimmer": "gold-shimmer 3s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        "gold-shimmer": {
          "0%, 100%": { opacity: "0.8", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
