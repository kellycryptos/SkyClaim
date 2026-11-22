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
        background: "#0B1120",
        canvas: "#0B1120",
        card: "#111827",
        elevated: "#161F33",
        border: "#1E293B",
        "border-subtle": "#263248",
        slate: {
          850: "#161F33",
          900: "#111827",
          950: "#0B1120",
        },
        muted: "#94A3B8",
        accent: {
          blue: "#2563EB",
          "blue-hover": "#1D4ED8",
          emerald: "#10B981",
          amber: "#F59E0B",
          gray: "#64748B",
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
