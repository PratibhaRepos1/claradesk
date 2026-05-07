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
      keyframes: {
        fadeIn:     { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp:   { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeInLeft: { '0%': { opacity: '0', transform: 'translateX(30px)' },  '100%': { opacity: '1', transform: 'translateX(0)' } },
        slideUp:    { '0%': { opacity: '0', transform: 'translateY(40px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        stamp: {
          '0%':   { opacity: '0', transform: 'scale(3) rotate(-12deg)' },
          '60%':  { opacity: '1', transform: 'scale(1.15) rotate(-6deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(-6deg)' },
        },
        ringPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 26, 140, 0.5)' },
          '50%':      { boxShadow: '0 0 0 16px rgba(255, 26, 140, 0)' },
        },
        slowSpin:   { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
      },
      animation: {
        'fade-in':       'fadeIn 0.5s ease-out forwards',
        'fade-in-up':    'fadeInUp 0.6s ease-out forwards',
        'fade-in-left':  'fadeInLeft 0.5s ease-out forwards',
        'slide-up':      'slideUp 0.7s ease-out forwards',
        'stamp':         'stamp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'ring-pulse':    'ringPulse 1.6s ease-out infinite',
        'slow-spin':     'slowSpin 8s linear infinite',
      },
    },
  },
  plugins: [],
}
