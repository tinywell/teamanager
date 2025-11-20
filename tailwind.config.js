/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tea: {
          50: '#f4f7f4',
          100: '#e3ebe3',
          200: '#c5d6c5',
          300: '#9bb69b',
          400: '#8a9a5b', // Base Sage
          500: '#6b7c45',
          600: '#546336',
          700: '#444f2d',
          800: '#384027',
          900: '#2f3623',
        },
        stone: {
          50: '#fafaf9',
          100: '#f5f5dc', // Base Cream
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        wood: {
          50: '#fbf7f3',
          100: '#f5ebe0',
          200: '#ebd5c1',
          300: '#debba1',
          400: '#cf9b7c',
          500: '#8b4513', // Base Brown
          600: '#7a3b11',
          700: '#65300f',
          800: '#532810',
          900: '#452211',
        },
        ink: {
          DEFAULT: '#36454F', // Charcoal
          light: '#4A5A65',
          dark: '#232D33',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
