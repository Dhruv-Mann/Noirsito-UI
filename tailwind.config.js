/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts,jsx,tsx}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './utils/**/*.{js,ts}',
    './App.{js,ts,vue}',
    './app.{js,ts,vue}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      colors: {
        ink: {
          DEFAULT: '#14110F',
          50: '#f7f6f5',
          100: '#e8e5e2',
          200: '#d0cbc5',
          300: '#b1a89f',
          400: '#8f8377',
          500: '#75685c',
          600: '#5e5248',
          700: '#4c423b',
          800: '#2b2522',
          900: '#14110F',
          950: '#0d0b0a'
        },
        paper: {
          DEFAULT: '#F7F3EC',
          50: '#ffffff',
          100: '#FAF8F4',
          200: '#F7F3EC',
          300: '#EFEAE1',
          400: '#E3DDD1',
          500: '#D5CDBF'
        },
        rust: {
          DEFAULT: '#C1502E',
          hover: '#A84224',
          light: '#E26D4B',
          soft: 'rgba(193, 80, 46, 0.12)'
        },
        teal: {
          deep: '#1F4B43',
          hover: '#163832',
          light: '#2E6E63',
          soft: 'rgba(31, 75, 67, 0.12)'
        },
        mustard: {
          DEFAULT: '#E3A008',
          dark: '#C28804',
          soft: 'rgba(227, 160, 8, 0.12)'
        },
        brick: {
          DEFAULT: '#8C2F1D',
          hover: '#732516',
          soft: 'rgba(140, 47, 29, 0.12)'
        }
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(20, 17, 15, 0.04), 0 1px 2px rgba(20, 17, 15, 0.06)',
        'apple-md': '0 8px 24px rgba(20, 17, 15, 0.06), 0 2px 6px rgba(20, 17, 15, 0.04)',
        'apple-lg': '0 16px 40px rgba(20, 17, 15, 0.08), 0 4px 12px rgba(20, 17, 15, 0.04)',
        'apple-dark': '0 16px 40px rgba(0, 0, 0, 0.5)'
      }
    }
  },
  plugins: []
}
