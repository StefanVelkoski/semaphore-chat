/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'custom-login-bg': '#fefcff',
        'custom-button': '#7D4AE9',
        'custom-button-hover': '#3D2D5F',
      },
    },
  },
  plugins: [],
};
