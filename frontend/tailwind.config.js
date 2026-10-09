/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        surface: '#ffffff',
        surfaceHover: '#f1f5f9',
        border: '#e2e8f0',
        primary: '#0ea5e9',
        primaryHover: '#0284c7',
        danger: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
        text: '#0f172a',
        textMuted: '#64748b'
      }
    },
  },
  plugins: [],
}
