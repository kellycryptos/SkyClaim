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
        background: "#090E1A",
        obsidian: "#090E1A",
        card: "#111827",
        elevated: "#131B2E",
        inset: "#0B1120",
        border: "#1E293B",
        "border-subtle": "rgba(255, 255, 255, 0.08)",
        electric: {
          DEFAULT: "#2563EB",
          hover: "#3B82F6",
        },
        emerald: {
          DEFAULT: "#10B981",
          bright: "#34D399",
        },
        amber: {
          DEFAULT: "#F59E0B",
          bright: "#FBBF24",
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['var(--font-sans)', 'Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
