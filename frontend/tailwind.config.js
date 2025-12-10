/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // IMPORTANT: This enables manual toggling of dark mode
  theme: {
    extend: {
      colors: {
        // The McLaren F1 Palette
        papaya: {
          DEFAULT: '#FF8700', // The iconic McLaren Orange
          light: '#FFA533',   // A slightly lighter shade for hovers
          dark: '#CC6C00',    // A darker shade for active states
        },
        anthracite: {
          DEFAULT: '#111827', // Your primary dark background (approx Gray-900)
          light: '#1F2937',   // Secondary dark (for cards/modals)
        },
        carbon: '#000000',    // Deepest black for contrast
        phantom: '#435761',   // McLaren Blue-Grey (Optional accent)
        glacier: '#F3F4F6',   // Light mode background
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Clean, modern, fast
      },
    },
  },
  plugins: [],
}
