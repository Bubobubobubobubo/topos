/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern: /hljs+/,
    },
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color0)",
        lineBackground: "var(--color1)",
        foreground: "var(--color2)",
        caret: "var(--color3)",
        selection: "var(--color4)",
        selectionMatch: "var(--color5)",
        gutterBackground: "var(--color6)",
        gutterForeground: "var(--color7)",
        gutterBorder: "var(--color8)",
        lineHighlight : "var(--color9)",
      },
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
