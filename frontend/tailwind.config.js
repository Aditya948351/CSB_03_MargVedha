/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      colors: {
        background: '#020617', // slate-950
        surface: '#0f172a', // slate-900
        surfaceHover: '#1e293b', // slate-800
        border: '#1e293b',
        primary: '#10b981', // emerald-500 (Cyber green)
        primaryHover: '#059669', // emerald-600
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
        text: '#f8fafc', // slate-50
        textMuted: '#94a3b8' // slate-400
      }
    },
  },
  plugins: [],
}
