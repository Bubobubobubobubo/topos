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
        color0: "var(--color0)",
        color1: "var(--color1)",
        color2: "var(--color2)",
        color3: "var(--color3)",
        color4: "var(--color4)",
        color5: "var(--color5)",
        color6: "var(--color6)",
        color7: "var(--color7)",
        color8: "var(--color8)",
        color9: "var(--color9)",
        color10: "var(--color10)",
        color11: "var(--color11)",
        color12: "var(--color12)",
        color13: "var(--color13)",
        color14: "var(--color14)",
        color15: "var(--color15)",
        background: "var(--background)",
        selection_foreground: "var(--selection_foreground)",
        cursor: "var(--cursor)",
        foreground: "var(--foreground)",
        selection_background: "var(--selection_background)",
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
