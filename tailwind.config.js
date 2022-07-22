/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "bounce-right": "bounce-right 1s infinite",
        "bounce-left": "bounce-left 1s infinite",
      },
      keyframes: {
        "bounce-right": {
          "0%, 100%": { transform: "translateX(-25%)" },
          "50%": { transform: "translateX(0)" },
        },
        "bounce-left": {
          "0%, 100%": { transform: "translateX(25%)" },
          "50%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
  ],
};
