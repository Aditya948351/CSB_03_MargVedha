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
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(-50%)' },
          '50%': { transform: 'translateY(-20px) translateX(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
