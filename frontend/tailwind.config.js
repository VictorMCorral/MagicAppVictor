/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Colores de Magic: The Gathering
        mtg: {
          white: '#F8F6D8',
          blue: '#0E68AB',
          black: '#150B00',
          red: '#D3202A',
          green: '#00733E',
          colorless: '#BEB9B2',
          gold: '#E4C089'
        }
      },
      fontFamily: {
        magic: ['Beleren', 'serif']
      }
    },
  },
  plugins: [],
}
