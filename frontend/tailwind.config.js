/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aqua-blue': '#1A73E8',
        'aqua-teal': '#00ACC1',
        'aqua-green': '#4CAF50',
        'aqua-light-bg': '#F5F5F5',
        'star-gold': '#FFD700',
        'provider-orange': '#FF9800',
        'user-purple': '#AB47BC',
        'sidebar-bg': '#1F2937',
        'sidebar-text': '#D1D5DB',
        'sidebar-hover': '#374151',
        'sidebar-active': '#FF9800', // Adjust based on role
      },
    },
  },
  plugins: [],
}