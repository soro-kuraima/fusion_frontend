const withMT = require("@material-tailwind/react/utils/withMT");
const plugin = require("tailwindcss/plugin");

module.exports = withMT({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      screens: {},

      backgroundImage: {},

      fontFamily: {
        outfit: ["var(--font-outfit)"],
      },

      colors: {},
    },
  },

  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {};

      addUtilities(newUtilities);
    }),
  ],
});
