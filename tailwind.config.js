import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        bg: '#f7f8fb',
        card: '#ffffff',
        accent: '#2b6ef6',
        danger: '#e24b4b'
      }
    }
  },
  plugins: []
}
