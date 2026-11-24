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
        navy: "#0B1226",
        deep: "#0A0F1F",
        cyan: {
          DEFAULT: "#22D3EE",
          accent: "#22D3EE",
        },
        sky: {
          DEFAULT: "#67E8F9",
          accent: "#67E8F9",
        },
        slate: {
          secondary: "#94A3B8",
        },
        cleared: "#34D399",
        hold: "#FBBF24",
        denied: "#F87171",
        background: "#0B1226",
        obsidian: "#0B1226",
        card: "#0A0F1F",
        elevated: "#111827",
        inset: "#070B14",
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
