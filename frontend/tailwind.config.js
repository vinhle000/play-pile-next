/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'primary': '#2580b3', // Example primary color from gradient
        'secondary': '#cbbacc', // Example secondary color from gradient
        'accent': '#f39f86', // Button background color
        'dark': '#222222', // A dark color for text or backgrounds
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(-225deg, #cbbacc 0%, #2580b3 100%)',
        'gradient-button': 'linear-gradient(315deg, #f39f86 0%, #f9d976 74%)',
      },
      borderRadius: {
        'lg': '0.5rem', // Standard large radius
        'md': '0.375rem', // Medium radius
        'sm': '0.25rem', // Small radius for subtle rounding
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-out': 'fade-out 0.5s ease-in',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'fade-out': {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
};
