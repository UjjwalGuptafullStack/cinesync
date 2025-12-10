/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // This is crucial for the toggle to work
  theme: {
    extend: {
      colors: {
        papaya: {
          DEFAULT: '#FF8700', // McLaren Orange
          dark: '#CC6C00',
        },
        anthracite: {
          DEFAULT: '#111827', // Main Background (Dark)
          light: '#1F2937',   // Card/Header Background (Lighter Dark)
        },
        // We force standard colors to match the theme
        gray: {
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
