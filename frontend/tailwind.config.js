/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        clara: {
          pink:    '#FF1A8C',
          magenta: '#C71585',
          purple:  '#7A1FA2',
          deep:    '#4A0072',
          sky:     '#5BC8F7',
          cream:   '#FFF5FB',
          ink:     '#1B0B26',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'clara-gradient':   'linear-gradient(135deg, #FF1A8C 0%, #C71585 35%, #7A1FA2 70%, #5BC8F7 100%)',
        'clara-gradient-2': 'linear-gradient(135deg, #7A1FA2 0%, #C71585 50%, #FF1A8C 100%)',
        'clara-gradient-3': 'linear-gradient(135deg, #5BC8F7 0%, #7A1FA2 100%)',
      },
      boxShadow: {
        'clara':    '0 20px 50px -20px rgba(199, 21, 133, 0.45)',
        'clara-sm': '0 8px 24px -10px rgba(122, 31, 162, 0.35)',
      },
    },
  },
  plugins: [],
}
