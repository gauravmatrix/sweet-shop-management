/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sweet: {
          primary: "#FF6B8B",
          secondary: "#4ECDC4",
          accent: "#FFD166",
          dark: "#2A2D43",
          light: "#F7F9FC",
          chocolate: "#7B3F00",
          candy: "#FF4081",
          cake: "#FF9800",
          cookie: "#8D6E63",
          dessert: "#2196F3",
          indian: "#F44336",
        },
      },
      fontFamily: {
        "sweet": ['"Comic Neue"', "cursive"],
        "heading": ['"Fredoka One"', "cursive"],
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-sweet": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "sweet-pattern": "url('https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
        "gradient-sweet": "linear-gradient(135deg, #FF6B8B 0%, #FFD166 100%)",
      },
    },
  },
  plugins: [],
}