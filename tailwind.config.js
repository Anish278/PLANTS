/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#143324',
          dark: '#0a1d14',
          light: '#A3C2B4',
        },
        secondary: '#143324',
        accent: {
          DEFAULT: '#DB663B',
          dark: '#b54d2a',
        },
        forest: '#143324',
        sage: '#A3C2B4',
        cream: '#F2EDE4',
        dark: '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
}
