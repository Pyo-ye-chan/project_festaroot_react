/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'festival-yellow': '#FFD23F',
        'deep-festival-purple': '#5B21B6',
        'warm-white': '#FAF9F6',
        'soft-purple': '#C7B0E6',
        'dark-gray': '#4A4A4A',
      },
    },
  },
  plugins: [],
}


