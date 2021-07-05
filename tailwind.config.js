const colors = require('tailwindcss/colors');
const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default;

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
        wiggle: 'wiggle .5s ease-in-out infinite'
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(6deg)' }
        }
      }
    },
  },
  variants: {
    extend: {
      animation: ['hover', 'focus']
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
};
