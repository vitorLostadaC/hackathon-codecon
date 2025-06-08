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
          900: "#201C1C",
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
        "animated-border": {
          "0%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
          "100%": {
            "background-position": "0% 50%",
          },
        },
      },
      animation: {
        "animated-border": "animated-border 4s linear infinite ",
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
