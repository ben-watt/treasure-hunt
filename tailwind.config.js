/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'parchment' : '2px 3px 5px rgb(32, 32, 32), 0 0 60px #8a4d0f inset'
      }
    },
  },
  plugins: [],
}