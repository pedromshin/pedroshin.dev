/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.page.{js,ts,jsx,tsx}",
    "./src/components/**/*.page.{js,ts,jsx,tsx}",
    "./src/app/**/*.page.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
