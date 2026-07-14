/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#5C0F8B",
          dark: "#3D0A5E",
          light: "#7B3FA0",
          tint: "rgba(92, 15, 139, 0.08)",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#8B1A1A",
          dark: "#6B1414",
          light: "#A83232",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F5C518",
          dark: "#D4A017",
          tint: "rgba(245, 197, 24, 0.15)",
          foreground: "#1A1A1A",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        body: "#374151",
        dark: "#1A1A1A",
        maroon: "#8B1A1A",
        "maroon-dark": "#6B1414",
        "maroon-light": "#A83232",
        gold: "#F5C518",
        "gold-dark": "#D4A017",
        violet: {
          brand: "#5C0F8B",
          dark: "#3D0A5E",
          light: "#7B3FA0",
        },
        offwhite: "#F9F9F9",
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        card: "0 4px 20px rgba(0,0,0,0.12)",
        "card-hover": "0 12px 40px rgba(0,0,0,0.1)",
        header: "0 2px 20px rgba(0,0,0,0.15)",
        dropdown: "0 8px 24px rgba(0,0,0,0.15)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
