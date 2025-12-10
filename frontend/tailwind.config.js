/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        papaya: {
          DEFAULT: '#FF8700', // McLaren Orange
          light: '#FFB84D',   // Softer Orange
          dark: '#CC6C00',    // Deep Orange
        },
        anthracite: {
          DEFAULT: '#111827', // Dark Mode Bg
          light: '#1F2937',   // Dark Mode Card Bg
        },
        black: '#000000',     // Pure Black
        white: '#FFFFFF',
        // Standard Grays
        gray: {
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
