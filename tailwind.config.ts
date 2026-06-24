import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7f3",
          100: "#d6ede2",
          200: "#aedcc6",
          300: "#7ec4a4",
          400: "#4ea681",
          500: "#2f8a66",
          600: "#226e52",
          700: "#1d5743",
          800: "#194537",
          900: "#15392e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
