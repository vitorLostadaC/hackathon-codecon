import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./gear.html",
    "./settings.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        tangerine: {
          200: "#DDA37A",
          400: "#FF8904",
          950: "#190A02",
        },
        granite: {
          100: "#C7C3C1",
          500: "#4E4946",
          800: "#36312E",
          950: "#151313",
        },
        smoke: {
          700: "#333333",
        },
        linen: {
          200: "#E8E5E5",
          300: "#D8CDCD",
          400: "#CCBDBD",
        },

        background: {
          secondary: "#201C1C",
          tertiary: "#353535",
          toggle: "#363030",
        },

        accent: {
          primary: "#FF6900",
          tertiary: "#FDA830",
        },
      },
      gradientColorStops: {
        "accent-from": "#FF6900",
        "accent-to": "#FF8904",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".region-drag": {
          "-webkit-app-region": "drag",
        },
        ".region-no-drag": {
          "-webkit-app-region": "no-drag",
        },
      });
    }),
  ],
};
