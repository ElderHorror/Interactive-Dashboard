/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Dark Terminal Theme - Modern Trading UI
        background: {
          base: '#0A0E27',
          surface: '#131722',
          elevated: '#1E222D',
          hover: '#252932',
        },
        border: {
          DEFAULT: '#2A2E39',
          light: '#363A45',
          focus: '#00C9FF',
        },
        text: {
          primary: '#E0E3EB',
          secondary: '#9598A1',
          tertiary: '#6B6E76',
          inverse: '#0A0E27',
        },
        accent: {
          primary: '#00C9FF',
          'primary-dark': '#0099FF',
          secondary: '#7B61FF',
        },
        bull: {
          DEFAULT: '#00E676',
          dark: '#00C853',
          light: '#69F0AE',
        },
        bear: {
          DEFAULT: '#FF3366',
          dark: '#E91E63',
          light: '#FF6090',
        },
        warning: {
          DEFAULT: '#FFB800',
          dark: '#FF8F00',
          light: '#FFD54F',
        },
        info: {
          DEFAULT: '#7B61FF',
          dark: '#5E35B1',
          light: '#9575CD',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': ['10px', { lineHeight: '14px' }],
        'sm': ['12px', { lineHeight: '16px' }],
        'base': ['14px', { lineHeight: '20px' }],
        'lg': ['16px', { lineHeight: '24px' }],
        'xl': ['18px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['32px', { lineHeight: '40px' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(0, 201, 255, 0.3)',
        'glow-green': '0 0 20px rgba(0, 230, 118, 0.3)',
        'glow-red': '0 0 20px rgba(255, 51, 102, 0.3)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-price': 'pulsePrice 0.6s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulsePrice: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};