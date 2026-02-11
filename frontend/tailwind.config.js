/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Paleta profesional de Magic: The Gathering v2.0
        mtg: {
          // Colores de mana tradicionales
          white: '#F8F6D8',
          blue: '#0E68AB',
          'blue-dark': '#002D5C',
          'blue-deep': '#001a4d',
          black: '#150B00',
          'black-dark': '#000000',
          red: '#D3202A',
          'red-deep': '#A50E00',
          green: '#00733E',
          'green-dark': '#005A00',
          colorless: '#BEB9B2',
          gold: '#E4C089',
          'gold-bright': '#FFD700',
          'gold-dark': '#DAA520',
          // Colores secundarios
          accent: '#FF6B35',
          'accent-light': '#FF8C42',
          // Tonos neutros
          'bg-dark': '#0a0e27',
          'bg-darker': '#050810',
          'text-light': '#E8E6E1',
          'text-muted': '#A8A5A0'
        }
      },
      fontFamily: {
        magic: ['Beleren', 'serif'],
        nexus: ['Inter', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'mtg-gradient': 'linear-gradient(135deg, #002D5C 0%, #150B00 50%, #00733E 100%)',
        'mtg-gold': 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
        'mtg-blue': 'linear-gradient(135deg, #0E68AB 0%, #002D5C 100%)'
      }
    },
  },
  plugins: [],
}
