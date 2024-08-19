const { transform } = require('next/dist/build/swc');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        'played': 'played 0.5s ease-out forwards',
      },
      keyframes: {
        played: {
          '100%': { top: '50%',  transform: ' scale(1)',  },
        }
      }
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#0c4a6e",

          "secondary": "#9a3412",

          "accent": "#065f46",

          "neutral": "#181818",

          "base-100": "#2c272a",
          "info": "#00d8ff",

          "success": "#00fa93",

          "warning": "#ff8d00",

          "error": "#ff6c76",

          "--rounded-btn": "0.5rem", // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1.9rem", // border radius rounded-badge utility class, used in badges and similar
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
