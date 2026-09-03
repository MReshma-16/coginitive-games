/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          silk: '#E6C687',      // Muga golden silk
          silkDark: '#C99E32',  // Deep Eri/Muga gold
          forest: '#1E432A',    // Lush North-East hills
          forestLight: '#2C5E3B',
          bamboo: '#8C6D3B',    // Traditional bamboo cane
          bambooLight: '#E8DFD1',
          terracotta: '#A84B29',// Traditional clay pottery
          terracottaDark: '#7C3218',
          river: '#1B6A78',     // Brahmaputra / Barak river teal
          riverLight: '#E6F4F6',
          cream: '#FAF7F0',     // Rice paper / warm parchment
          paper: '#F4EFE6',
          crimson: '#9B1D20',   // Traditional Naga/Manipuri woven red
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Mukta"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Merriweather"', '"Noto Serif Bengali"', 'Georgia', 'serif'],
        heading: ['"Philosopher"', '"Merriweather"', 'serif'],
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(140, 109, 59, 0.15)',
        'warm-lg': '0 10px 30px -4px rgba(140, 109, 59, 0.25)',
      }
    },
  },
  plugins: [],
}
