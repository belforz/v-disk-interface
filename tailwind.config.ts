import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx,css}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Barlow Condensed'", "ui-sans-serif", "system-ui"],
        body: ["Inter", "ui-sans-serif", "system-ui"]
      },
      colors: { ink: "#0a0a0a" }
    }
  },
  plugins: []
} satisfies Config;
