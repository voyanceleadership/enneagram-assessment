import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'loading-bar': 'loading 2s infinite linear',
        'spin-slow': 'spin 1.5s linear infinite',
      },
      keyframes: {
        loading: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        // spin is already included in Tailwind by default, so we don't need to define it
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // for the prose class in the analysis section
  ],
} satisfies Config;