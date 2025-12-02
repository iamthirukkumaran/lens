/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"], // MAIN FONT
        serif: ["var(--font-playfair)", "serif"], // OPTIONAL (Headings)
      },

      colors: {
        primary: "#111827",
        secondary: "#374151",
        accent: "#0d9488",
      },

      animation: {
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "float-slow": "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s infinite linear",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },

      boxShadow: {
        soft: "0 4px 30px rgba(0, 0, 0, 0.03)",
        luxe: "0 20px 60px rgba(0, 0, 0, 0.08)",
        "inner-luxe": "inset 0 2px 4px rgba(255, 255, 255, 0.1)",
      },

      backdropBlur: {
        xs: "2px",
      },

      spacing: {
        128: "32rem",
        144: "36rem",
      },
    },
  },
  plugins: [],
};
