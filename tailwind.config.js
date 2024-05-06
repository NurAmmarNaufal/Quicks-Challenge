/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        "primary_gray": "#4F4F4F",
        "primary_gray_bg": "#333232",
        "primary_light_gray": "#828282",
        "primary_blue": "#2F80ED",
        "primary_white": "#E0E0E0",
      }
    },
  },
  plugins: [],
}