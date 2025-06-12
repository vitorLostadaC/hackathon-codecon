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
          300: "#FDA830",
          400: "#FF8904",
          500: "#FF6900",
          950: "#190A02",
        },

        gray: {
          50: "#FAFAFA",
          100: "#F3F1F1",
          200: "#E7E4E4",
          300: "#CFC9C9",
          400: "#C3BBBB",
          500: "#ACA0A0",
          600: "#887777",
          700: "#5F5454",
          800: "#363030",
          900: "#201C1C",
          950: "#151313",
        },
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
    require("tailwindcss-animate"),
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
