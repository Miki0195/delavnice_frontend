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
          DEFAULT: '#5BC5C9',
          dark: '#4AB5B9',
          light: '#6BD5D9',
        },
        secondary: {
          DEFAULT: '#5BCB59',
          dark: '#4ABB49',
          light: '#6BDB69',
        },
        gray: {
          dark: '#4A4A4A',
          medium: '#6B6B6B',
          light: '#F5F5F5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
