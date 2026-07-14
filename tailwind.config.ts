import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-charcoal": "#0a0a0a",
        "dark-surface": "#111111",
        "dark-card": "#1a1a1a",
        "dark-border": "#2a2a2a",
        "neon-cyan": "#00f0ff",
        "neon-purple": "#b026ff",
        "neon-pink": "#ff2d95",
        "marvel-red": "#e23636",
        "muted-gray": "#888888",
        "light-gray": "#cccccc",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        marvel: ["var(--font-anton)", "sans-serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "pulse-glow-cyan": "pulse-glow-cyan 2s ease-in-out infinite",
        "pulse-glow-purple": "pulse-glow-purple 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "slide-in-right": "slideInRight 0.4s ease-out forwards",
        "spin-slow": "spin 8s linear infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow-cyan": {
          "0%, 100%": { boxShadow: "0 0 5px #00f0ff, 0 0 20px rgba(0, 240, 255, 0.3)" },
          "50%": { boxShadow: "0 0 20px #00f0ff, 0 0 60px rgba(0, 240, 255, 0.5)" },
        },
        "pulse-glow-purple": {
          "0%, 100%": { boxShadow: "0 0 5px #b026ff, 0 0 20px rgba(176, 38, 255, 0.3)" },
          "50%": { boxShadow: "0 0 20px #b026ff, 0 0 60px rgba(176, 38, 255, 0.5)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "radial-gradient(ellipse at center, rgba(0, 240, 255, 0.08) 0%, rgba(176, 38, 255, 0.05) 40%, transparent 70%)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".glass-panel": {
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
        },
        ".glass-panel-strong": {
          background: "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: "20px",
        },
        ".glow-cyan": {
          boxShadow: "0 0 15px rgba(0, 240, 255, 0.4), 0 0 45px rgba(0, 240, 255, 0.1)",
        },
        ".glow-purple": {
          boxShadow: "0 0 15px rgba(176, 38, 255, 0.4), 0 0 45px rgba(176, 38, 255, 0.1)",
        },
        ".glow-cyan-text": {
          textShadow: "0 0 10px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.2)",
        },
        ".glow-purple-text": {
          textShadow: "0 0 10px rgba(176, 38, 255, 0.5), 0 0 40px rgba(176, 38, 255, 0.2)",
        },
        ".text-gradient-marvel": {
          background: "linear-gradient(135deg, #00f0ff 0%, #b026ff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        },
      });
    }),
  ],
};

export default config;
