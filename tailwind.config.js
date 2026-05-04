import tailwindAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        green: {
          DEFAULT: "#468432",
          50: "#EDF7E9",
          100: "#D8EFCF",
          200: "#B8E1A9",
          300: "#9AD872",
          400: "#75BF54",
          500: "#468432",
          600: "#3B722A",
          700: "#315F23",
          800: "#284D1D",
          900: "#1D3915",
        },
        leaf: {
          DEFAULT: "#9AD872",
          50: "#F4FBEF",
          100: "#E6F6DC",
          200: "#CFF0BC",
          300: "#B8E99D",
          400: "#A6E184",
          500: "#9AD872",
          600: "#76BE52",
          700: "#5C9E3E",
          800: "#477C31",
          900: "#315822",
        },
        yellow: {
          DEFAULT: "#FFEF91",
          50: "#FFFDF0",
          100: "#FFF9D6",
          200: "#FFF5BD",
          300: "#FFEF91",
          400: "#FFE665",
          500: "#FFDC38",
          600: "#E6BE1F",
          700: "#BD9818",
          800: "#947313",
          900: "#6B510D",
        },
        orange: {
          DEFAULT: "#FFA02E",
          50: "#FFF4E6",
          100: "#FFE5C2",
          200: "#FFD399",
          300: "#FFC16F",
          400: "#FFB04A",
          500: "#FFA02E",
          600: "#D98220",
          700: "#B36819",
          800: "#8C5013",
          900: "#66380D",
        },
        cream: {
          DEFAULT: "#FFEF91",
          50: "#FFFDF0",
          100: "#FFF9D6",
          200: "#FFF5BD",
          300: "#FFEF91",
          400: "#FFE665",
          500: "#FFDC38",
          600: "#E6BE1F",
          700: "#BD9818",
          800: "#947313",
          900: "#6B510D",
        },
        charcoal: "#1D3915",

        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",

        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
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
  plugins: [tailwindAnimate],
};