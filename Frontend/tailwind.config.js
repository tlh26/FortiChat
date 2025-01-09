/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/Pages/*.{js,ts,jsx,tsx}",
    "./src/main.jsx",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#89A8B2',
        'secondary': '#B3C8CF',
        'light': '#E5E1DA',
        'lighter': '#F1F0E8',
      },
    },
  },
  plugins: [],
};