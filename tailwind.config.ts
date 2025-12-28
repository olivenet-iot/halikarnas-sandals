import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Shadcn/UI colors (CSS variables)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },

        // Luxury Brand Colors
        luxury: {
          // Primary - Dark Petrol (Aegean)
          primary: {
            DEFAULT: "#1e3a3a",
            light: "#2d5555",
            dark: "#152a2a",
          },
          // Secondary - Gold (Craftsmanship)
          gold: {
            DEFAULT: "#c9a962",
            light: "#d4b87a",
            dark: "#b89a52",
          },
          // Accent - Terracotta (Mediterranean)
          terracotta: {
            DEFAULT: "#e07d4c",
            light: "#e89670",
            dark: "#c96a3c",
          },
          // Neutrals
          cream: "#faf9f6",
          ivory: "#f5f4f0",
          stone: "#e8e6e1",
          charcoal: "#2d2d2d",
        },

        // Halikarnas Brand Colors (legacy support)
        sand: {
          50: "#FAF8F5",
          100: "#F5F0E8",
          200: "#EBE1D1",
          300: "#D4B896",
          400: "#C4A67E",
          500: "#B49466",
          600: "#9A7B4F",
          700: "#7D6340",
          800: "#604B31",
          900: "#433322",
        },
        aegean: {
          50: "#E8F4F6",
          100: "#C5E4E9",
          200: "#9FD3DB",
          300: "#79C1CD",
          400: "#53B0BF",
          500: "#1E5F74",
          600: "#1A5367",
          700: "#154659",
          800: "#113A4B",
          900: "#0D2E3D",
        },
        terracotta: {
          50: "#FCF5F2",
          100: "#F8E7E0",
          200: "#F0CEBF",
          300: "#E5AC95",
          400: "#D9896B",
          500: "#C17E61",
          600: "#A66A50",
          700: "#8A5740",
          800: "#6D4432",
          900: "#503224",
        },
        leather: {
          50: "#F5F3F2",
          100: "#E8E4E2",
          200: "#D1C9C5",
          300: "#B8ADA7",
          400: "#9E9189",
          500: "#8B8178",
          600: "#6E655D",
          700: "#524A43",
          800: "#4A3728",
          900: "#2D2926",
        },
        olive: {
          gold: "#A68B5B",
        },
        sea: {
          foam: "#A8C4C4",
        },
      },
      fontFamily: {
        // Luxury typography
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-cinzel)", "Georgia", "serif"],
        // Legacy aliases
        heading: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        accent: ["var(--font-cinzel)", "Georgia", "serif"],
      },
      fontSize: {
        "display-1": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-2": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "heading-1": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "heading-2": ["2.25rem", { lineHeight: "1.25" }],
        "heading-3": ["1.875rem", { lineHeight: "1.3" }],
        "heading-4": ["1.5rem", { lineHeight: "1.35" }],
        "heading-5": ["1.25rem", { lineHeight: "1.4" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        caption: ["0.75rem", { lineHeight: "1.4" }],
      },
      spacing: {
        section: "6rem",
        "section-lg": "8rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        medium: "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.04)",
        strong: "0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 50px -10px rgba(0, 0, 0, 0.08)",
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
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-in-out",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
