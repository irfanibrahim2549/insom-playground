import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0088ff',
          600: '#0066cc',
          700: '#004c99',
        },
        badge: {
          unassigned: '#ff4d4f',
          assigned: '#1890ff',
          expired: '#8c8c8c',
          unreply: '#faad14',
        }
      },
    },
  },
  plugins: [],
};
export default config;
