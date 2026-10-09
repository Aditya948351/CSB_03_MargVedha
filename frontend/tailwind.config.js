/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0f18',
        surface: '#151b28',
        surfaceHover: '#1f2937',
        border: '#2d3748',
        primary: '#0ea5e9',
        primaryHover: '#0284c7',
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
        text: '#f8fafc',
        textMuted: '#94a3b8'
      }
    },
  },
  plugins: [],
}
