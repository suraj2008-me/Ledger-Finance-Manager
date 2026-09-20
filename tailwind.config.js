/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#12181B',
          50: '#F1F3EE',
          100: '#E4E7E1',
          200: '#C9CFC4',
          300: '#9FA89A',
          400: '#6C766B',
          500: '#454E44',
          600: '#2E3632',
          700: '#1F2624',
          800: '#171D1B',
          900: '#12181B',
          950: '#0B0F10',
        },
        paper: {
          DEFAULT: '#F1F3EE',
          dim: '#E7E9E1',
        },
        ledger: {
          DEFAULT: '#1F5F4F',
          50: '#EAF3F0',
          100: '#CFE3DC',
          200: '#9EC7B8',
          300: '#6DAB95',
          400: '#3F8B71',
          500: '#1F5F4F',
          600: '#1A4F42',
          700: '#153F35',
          800: '#102F28',
          900: '#0B201B',
        },
        rust: {
          DEFAULT: '#B4502A',
          50: '#F7E9E2',
          100: '#EDC9B6',
          200: '#DFA284',
          300: '#D07A52',
          400: '#C06232',
          500: '#B4502A',
          600: '#8F3F21',
          700: '#6B2F19',
          800: '#4A2011',
          900: '#2D140B',
        },
        amber: {
          DEFAULT: '#C98A2C',
        },
        hairline: '#D9D5C9',
        'hairline-dark': '#2B3230',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Poppins"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
      },
      boxShadow: {
        none: 'none',
        subtle: '0 1px 2px rgba(18,24,27,0.06)',
      },
      keyframes: {
        countup: {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        countup: 'countup 0.5s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
