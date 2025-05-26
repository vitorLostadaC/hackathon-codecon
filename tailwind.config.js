/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './gear.html', './settings.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Text colors at root level
        primary: '#E8E5E5',
        secondary: '#CCBDBD',
        tertiary: '#C7C3C1',
        // Background colors
        background: {
          primary: '#151313',
          secondary: '#201C1C',
          tertiary: '#353535',
          input: '#333333',
          toggle: '#363030'
        },
        border: {
          primary: '#DDA37A',
          secondary: '#4E4946',
          tertiary: '#333333'
        },
        accent: {
          primary: '#FF6900',
          secondary: '#FF8904'
        }
      },
      gradientColorStops: {
        'accent-from': '#FF6900',
        'accent-to': '#FF8904'
      }
    }
  },
  plugins: []
}
