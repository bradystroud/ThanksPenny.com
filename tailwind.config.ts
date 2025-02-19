import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: 'hsl(var(--border))',
        iwd: { // International Women's Day
          primary: '#6A0DAD', // Deep purple
          accent: '#FFFFFF', // White
          softLilac: '#D9B3FF', // Soft lilac
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
