/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        "width": "width",
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms")
  ],
}
