/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern: /hljs+/,
    },
  ],
  theme: {
    colors: {
      background: "var(--background)",
      lineBackground: "var(--lineBackground)",
      foreground: "var(--foreground)",
      caret: "var(--caret)",
      selection: "var(--selection)",
      selectionMatch: "var(--selectionMatch)",
      gutterBackground: "var(--gutterBackground)",
      gutterForeground: "var(--gutterForeground)",
      gutterBorder: "var(--gutterBorder)",
      lineHighlight : "var(--lineHighlight)",
    },
    extend: {},
    hljs: {
      theme: "nord",
      custom: {
        general: {
          comment: "#FEFEFE",
        },
      },
    },
  },
  plugins: [require("tailwind-highlightjs")],
};
