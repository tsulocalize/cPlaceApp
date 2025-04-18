/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        50: "repeat(50, minmax(0, 1fr))",
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.image-rendering-pixelated': {
          imageRendering: 'pixelated',
        },
        '.image-rendering-crisp-edges': {
          imageRendering: 'crisp-edges',
        },
      })
    },
  ],
};


