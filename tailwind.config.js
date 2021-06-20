const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors,
      animation: {
        spinslow: 'spin 20s linear infinite'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
