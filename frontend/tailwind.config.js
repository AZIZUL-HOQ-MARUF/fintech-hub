/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./src/**/*.{html,ts,scss}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      aspectRatio: {
        '4/3': '4 / 3',
        '10/6': '10 / 6',
        '10/7': '10 / 7',
      },
      colors: {
        primary: {
          50: '#e7f3ff',
          100: '#cce6ff',
          200: '#99ccff',
          300: '#66b3ff',
          400: '#3399ff',
          500: '#007bff', // main
          600: '#0056b3',
          700: '#004080',
          800: '#00264d',
          900: '#001326',
          DEFAULT: '#007bff',
        },
        light: '#f8f9fa',
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          DEFAULT: '#1e293b',
        },
        sidebar: {
          DEFAULT: '#2c3e50',
          hover: '#34495e',
          foreground: '#ecf0f1',
          'foreground-muted': '#95a5a6',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          DEFAULT: '#6b7280',
        },
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          DEFAULT: '#dc2626',
        },
      },
    },
  },
  plugins: [],
}
