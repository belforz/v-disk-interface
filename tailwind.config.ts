import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx,css}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Barlow Condensed'", "ui-sans-serif", "system-ui"],
        body: ["Inter", "ui-sans-serif", "system-ui"]
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeOut:{ "0%": { opacity: "1" }, "100%": { opacity: "0" } },
        riseIn: { "0%": { opacity:"0", transform:"translateY(6px)" }, "100%": { opacity:"1", transform:"translateY(0)" } }
      },
      colors: { ink: "#0a0a0a" },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "fade-out":"fadeOut 0.35s ease-in forwards",
        "rise-in":"riseIn 0.45s ease-out forwards",
      }
    }
  },
  plugins: []
} satisfies Config;
