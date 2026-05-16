/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "medium-blue": {
          50: "hsl(var(--medium-blue-50))",
          100: "hsl(var(--medium-blue-100))",
          200: "hsl(var(--medium-blue-200))",
          300: "hsl(var(--medium-blue-300))",
          400: "hsl(var(--medium-blue-400))",
          500: "hsl(var(--medium-blue-500))",
          600: "hsl(var(--medium-blue-600))",
          700: "hsl(var(--medium-blue-700))",
          800: "hsl(var(--medium-blue-800))",
          900: "hsl(var(--medium-blue-900))",
          950: "hsl(var(--medium-blue-950))",
        },
        ikb: {
          50: "hsl(var(--ikb-50))",
          100: "hsl(var(--ikb-100))",
          200: "hsl(var(--ikb-200))",
          300: "hsl(var(--ikb-300))",
          400: "hsl(var(--ikb-400))",
          500: "hsl(var(--ikb-500))",
          600: "hsl(var(--ikb-600))",
          700: "hsl(var(--ikb-700))",
          800: "hsl(var(--ikb-800))",
          900: "hsl(var(--ikb-900))",
          950: "hsl(var(--ikb-950))",
        },
        navy: {
          50: "hsl(var(--navy-50))",
          100: "hsl(var(--navy-100))",
          200: "hsl(var(--navy-200))",
          300: "hsl(var(--navy-300))",
          400: "hsl(var(--navy-400))",
          500: "hsl(var(--navy-500))",
          600: "hsl(var(--navy-600))",
          700: "hsl(var(--navy-700))",
          800: "hsl(var(--navy-800))",
          900: "hsl(var(--navy-900))",
          950: "hsl(var(--navy-950))",
        },
        ultramarine: {
          50: "hsl(var(--ultramarine-50))",
          100: "hsl(var(--ultramarine-100))",
          200: "hsl(var(--ultramarine-200))",
          300: "hsl(var(--ultramarine-300))",
          400: "hsl(var(--ultramarine-400))",
          500: "hsl(var(--ultramarine-500))",
          600: "hsl(var(--ultramarine-600))",
          700: "hsl(var(--ultramarine-700))",
          800: "hsl(var(--ultramarine-800))",
          900: "hsl(var(--ultramarine-900))",
          950: "hsl(var(--ultramarine-950))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(59,130,246,0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(59,130,246,0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "pulse-glow": "pulse-glow 2s infinite",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
