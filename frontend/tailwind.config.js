/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        cricket: {
          green: "#4CAF50",
          "dark-green": "#2E7D32",
          "light-green": "#81C784",
          blue: "#2196F3",
          "dark-blue": "#1565C0",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
