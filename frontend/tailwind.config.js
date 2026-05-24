/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-highlight': 'var(--color-surface-highlight)',
        'surface-border': 'var(--color-surface-border)',

        content: 'var(--color-content)',
        'content-muted': 'var(--color-content-muted)',

        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-secondary-hover)',
        },

        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, var(--color-primary), var(--color-secondary))',
      },
    },
  },
  plugins: [],
}
