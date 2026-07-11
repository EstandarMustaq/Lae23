/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003366',
        secondary: '#FF6B35',
        accent: '#00A898',
        success: '#00A898',
        warning: '#FF9500',
        danger: '#E74C3C',
        background: '#F5F5F5',
        surface: '#FFFFFF',
        text: '#333333',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
