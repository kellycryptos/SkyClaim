/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090C",
        card: "#0F1116",
        border: "#1C2028",
        muted: "#848D9E",
        accent: {
          blue: "#2563EB",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#EF4444",
        }
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
        sans: ['var(--font-sans)', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
