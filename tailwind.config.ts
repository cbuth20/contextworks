import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        contextworks: {
          // Primary
          black: "#111827",          // Heading text color
          graphite: "#FFFFFF",       // Card/surface backgrounds

          // Accent
          gold: "#D4AF37",
          "gold-soft": "#E6C766",

          // Text
          silver: "#111827",         // Primary text
          "silver-muted": "#6B7280", // Secondary/muted text

          // Borders
          steel: "#E5E7EB",

          // Page background
          bg: "#F9FAFB",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
