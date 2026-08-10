/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#fbbf24',
        'primary-dark': '#d97706',
        secondary: '#030712',
        accent: '#f59e0b',
        success: '#fbbf24',
        warning: '#f59e0b',
        danger: '#ef4444',
        neutral: '#9ca3af',
        bg: '#030712',
        surface: '#111827'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
