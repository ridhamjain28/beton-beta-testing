/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        serif: ["Montserrat", "system-ui", "sans-serif"],
        mono: ["Montserrat", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["3.5rem", { lineHeight: "1.08", fontWeight: "600", letterSpacing: "0" }],
        "display-lg": ["2.75rem", { lineHeight: "1.12", fontWeight: "600", letterSpacing: "0" }],
        "display-md": ["2.125rem", { lineHeight: "1.18", fontWeight: "600", letterSpacing: "0" }],
        "heading-lg": ["1.75rem", { lineHeight: "1.22", fontWeight: "600", letterSpacing: "0" }],
        "heading-md": ["1.375rem", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "0" }],
        "heading-sm": ["1.125rem", { lineHeight: "1.35", fontWeight: "600", letterSpacing: "0" }],
        "body-lg": ["1.125rem", { lineHeight: "1.65", fontWeight: "400", letterSpacing: "0" }],
        "body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400", letterSpacing: "0" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400", letterSpacing: "0" }],
        caption: ["0.8125rem", { lineHeight: "1.4", fontWeight: "500", letterSpacing: "0" }],
        label: ["0.75rem", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "0.12em" }],
      },
    },
  },
  plugins: [],
}
