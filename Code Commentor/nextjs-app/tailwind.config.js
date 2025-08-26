/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",     // ✅ your globals.css + page.tsx
    "./components/**/*.{js,ts,jsx,tsx}", // ✅ if you have components
    "./pages/**/*.{js,ts,jsx,tsx}",   // ✅ if you use /pages (probably empty)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
