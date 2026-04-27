/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#C8FF5A',
        'bg-base': '#0A0A0A',
        'bg-card': '#111111',
        'bg-card2': '#1A1A1A',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 20px rgba(200, 255, 90, 0.3)',
        'neon-lg': '0 0 40px rgba(200, 255, 90, 0.4)',
      }
    },
  },
  plugins: [],
}
