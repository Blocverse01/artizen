/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "app-dark": "#0B0B0F",
        "app-light": "#30FFB4",
        "app-alt-dark": "#16161A",
      },
      fontFamily: {
        "sf-pro": ["var(--font-sf-pro)"],
      },
    },
  },
  plugins: [],
};
