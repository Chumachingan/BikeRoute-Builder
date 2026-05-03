import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 20px 45px rgba(15, 23, 42, 0.08)',
        'emerald-glow': '0 0 20px rgba(16, 185, 129, 0.1)',
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#10b981',
          600: '#059669',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
