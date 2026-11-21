/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        campus: { forest: '#1d573f', deep: '#164530', pale: '#eaf2eb', paper: '#f3f5f1' },
      },
      fontFamily: {
        sans: ['Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
