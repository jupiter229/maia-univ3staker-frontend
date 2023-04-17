/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/views/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        blue: "#6a98eb",
        dark: {
          light: "#121A2A",
          medium: "#121625",
          hard:"#0d111c"
        }
      }
    },
  },
  plugins: [],
}

