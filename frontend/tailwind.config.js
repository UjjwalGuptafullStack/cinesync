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
        // McLaren Palette
        papaya: {
          DEFAULT: '#FF8700', // Primary Action
          dark: '#CC6C00',
        },
        anthracite: {
          DEFAULT: '#111827', // Main Background
          light: '#1F2937',   // Card/Navbar Background
        },
        white: '#F9FAFB',
        gray: {
          400: '#9CA3AF',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
        },
        red: {
          500: '#EF4444', // Spoilers/Errors
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
