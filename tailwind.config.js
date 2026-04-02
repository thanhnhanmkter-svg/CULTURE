/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        oppo: {
          green:  '#008a5e',
          dark:   '#005a3d',
          light:  '#00b87a',
          glow:   '#00ffa3',
        },
      },
      fontFamily: {
        sans: ['var(--font-sora)', 'sans-serif'],
      },
      animation: {
        'float-up':   'floatUp 2.5s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
        'scale-in':   'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'fade-up':    'fadeUp 0.5s ease forwards',
        'bar-grow':   'barGrow 0.8s cubic-bezier(0.34,1.2,0.64,1) forwards',
      },
      keyframes: {
        floatUp: {
          '0%':   { opacity: 1,   transform: 'translateY(0) scale(1)' },
          '80%':  { opacity: 0.6, transform: 'translateY(-80vh) scale(1.3)' },
          '100%': { opacity: 0,   transform: 'translateY(-95vh) scale(0.8)' },
        },
        scaleIn: {
          from: { opacity: 0, transform: 'scale(0.8)' },
          to:   { opacity: 1, transform: 'scale(1)' },
        },
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        barGrow: {
          from: { transform: 'scaleY(0)', transformOrigin: 'bottom' },
          to:   { transform: 'scaleY(1)', transformOrigin: 'bottom' },
        },
      },
    },
  },
  plugins: [],
}
