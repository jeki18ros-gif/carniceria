/** @type {import('tailwindcss').Config} */
export default {
  // In Tailwind v4 no 'content' key is required for basic usage
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#e6efff',
          200: '#c4d9ff',
          300: '#9ec1ff',
          400: '#72a1ff',
          500: '#4b84ff', // primary
          600: '#3366e6',
          700: '#284fba',
          800: '#203f94',
          900: '#1c3578',
          950: '#0f2047',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};
