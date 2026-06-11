/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderWidth: {
        3: "3px",
      },
      backgroundImage: {
        "header-gradient": "linear-gradient(135deg, #15803d 0%, #166534 60%, #14532d 100%)",
        "grid-lines": "repeating-linear-gradient(90deg, white 0, white 1px, transparent 1px, transparent 60px)",
      },
      keyframes: {
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":       { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "bounce-slow": "bounce-slow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
