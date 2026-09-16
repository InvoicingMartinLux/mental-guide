import type { Config } from "tailwindcss";

/**
 * WellPath — warm, approachable, wellness-oriented design tokens.
 * Colors, radii and elevation come straight from the WellPath spec.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary — Sage
        sage: {
          50: "#EDF5EB",
          100: "#DCEBD7",
          200: "#C2DBB8",
          300: "#A3C695",
          400: "#8DAF7E",
          DEFAULT: "#7C9A6E",
          500: "#7C9A6E",
          600: "#6B8A5D",
          700: "#5A7A4E",
          // Accessible sage for text on light surfaces (>= 4.5:1).
          ink: "#4F6B45",
        },
        // Secondary — Lavender
        lavender: {
          50: "#F5F0FB",
          100: "#EDE6F7",
          200: "#E8E4EE",
          300: "#D1CBD9",
          DEFAULT: "#B4A7D6",
          400: "#B4A7D6",
          500: "#9C8CC7",
          700: "#7A6FA0",
        },
        // Tertiary — Peach
        peach: {
          50: "#FFF6E8",
          DEFAULT: "#FFCBA4",
          400: "#FFCBA4",
          600: "#E0A849",
          700: "#B08930",
        },
        // Neutrals
        ink: "#2D2B32",
        muted: "#6B6772",
        warmgray: "#A8A29E",
        canvas: "#FAF8FF",
        surface: "#FFFFFF",
        // Feedback
        success: { DEFAULT: "#7C9A6E", bg: "#EDF5EB", ink: "#5A7A4E" },
        warning: { DEFAULT: "#E0A849", bg: "#FFF6E8", ink: "#B08930" },
        danger: {
          DEFAULT: "#C97A7A",
          600: "#B56B6B",
          bg: "#FFF0F0",
          tint: "#FFF5F5",
          ink: "#A05A5A",
        },
        info: { DEFAULT: "#B4A7D6", bg: "#F0ECF8", ink: "#7A6FA0" },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        // Neumorphism-inspired: surfaces push softly out of the background.
        subtle:
          "4px 4px 8px rgba(174, 168, 186, 0.15), -4px -4px 8px rgba(255, 255, 255, 0.7)",
        medium:
          "6px 6px 14px rgba(174, 168, 186, 0.2), -6px -6px 14px rgba(255, 255, 255, 0.8)",
        large:
          "10px 10px 24px rgba(174, 168, 186, 0.25), -10px -10px 24px rgba(255, 255, 255, 0.9)",
        overlay: "0 16px 48px rgba(45, 43, 50, 0.12)",
        inner:
          "inset 3px 3px 6px rgba(174, 168, 186, 0.2), inset -3px -3px 6px rgba(255, 255, 255, 0.7)",
      },
      spacing: {
        // 8px base unit scale
        18: "4.5rem",
        section: "3rem",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-nunito)", "system-ui", "sans-serif"],
        mono: ["var(--font-source-code-pro)", "ui-monospace", "monospace"],
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.55" },
          "50%": { transform: "scale(1.06)", opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        breathe: "breathe 5s ease-in-out infinite",
        "fade-up": "fade-up 300ms ease both",
      },
    },
  },
  plugins: [],
};

export default config;
