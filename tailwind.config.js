/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A192F',
          dark: '#050D18',
        },
        beige: {
          DEFAULT: '#F4F1EA',
          dark: '#E2DCD2',
        },
        teal: {
          DEFAULT: '#0D9488',
          dark: '#0B7B71',
        },
      },
    },
  },
  plugins: [],
}