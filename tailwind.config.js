/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter var', 'sans-serif'],
      },
      colors: {
        background: '#f2f2f5',
        shadow: '#94cbff',
      },
      cursor: {
        'grab': 'grab',
        'grabbing': 'grabbing',
      },
    },
  },
  plugins: [],
}
