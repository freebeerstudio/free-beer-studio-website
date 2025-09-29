/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './frontend/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Free Beer Studio brand colors
        'rocket-gray': '#5A6A76',
        'jet-black': '#1C1C1C',
        'launch-orange': '#D95F2C',
        'vapor-purple': '#9D82C1',
        'smoky-lavender': '#B49CD6',
        'cloud-white': '#F1F1F1',
        
        // shadcn/ui colors adapted for dark theme
        border: "hsl(214.3 31.8% 91.4%)",
        input: "hsl(214.3 31.8% 91.4%)",
        ring: "hsl(222.2 84% 4.9%)",
        background: "#1C1C1C",
        foreground: "#F1F1F1",
        primary: {
          DEFAULT: "#9D82C1",
          foreground: "#F1F1F1",
        },
        secondary: {
          DEFAULT: "#5A6A76",
          foreground: "#F1F1F1",
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(210 40% 98%)",
        },
        muted: {
          DEFAULT: "#5A6A76",
          foreground: "#B49CD6",
        },
        accent: {
          DEFAULT: "#D95F2C",
          foreground: "#1C1C1C",
        },
        popover: {
          DEFAULT: "#1C1C1C",
          foreground: "#F1F1F1",
        },
        card: {
          DEFAULT: "#1C1C1C",
          foreground: "#F1F1F1",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'architects-daughter': ['Architects Daughter', 'cursive'],
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
        fadeIn: {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1", 
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.6s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
