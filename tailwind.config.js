/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.html", "./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    {
      pattern: /hljs+/,
    },
  ],
  theme: {
      colors: {
        color0: "rgb(var(--color0) / <alpha-value>)",
        color1: "rgb(var(--color1) / <alpha-value>)",
        color2: "rgb(var(--color2) / <alpha-value>)",
        color3: "rgb(var(--color3) / <alpha-value>)",
        color4: "rgb(var(--color4) / <alpha-value>)",
        color5: "rgb(var(--color5) / <alpha-value>)",
        color6: "rgb(var(--color6) / <alpha-value>)",
        color7: "rgb(var(--color7) / <alpha-value>)",
        color8: "rgb(var(--color8) / <alpha-value>)",
        color9: "rgb(var(--color9) / <alpha-value>)",
        color10: "rgb(var(--color10) / <alpha-value>)",
        color11: "rgb(var(--color11) / <alpha-value>)",
        color12: "rgb(var(--color12) / <alpha-value>)",
        color13: "rgb(var(--color13) / <alpha-value>)",
        color14: "rgb(var(--color14) / <alpha-value>)",
        color15: "rgb(var(--color15) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        selection_foreground: "rgb(var(--selection_foreground) / <alpha-value>)",
        cursor: "rgb(var(--cursor) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        selection_background: "rgb(var(--selection_background) / <alpha-value>)",
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
  safelist: {
    pattern: /(bg|text|border)-(transparent|color0|color1|color2|color3|color4|color5|color6|color7|color8|color9|color10|color11|color12|color13|color14|color15|background|selection_background|cursor|foreground|selection_background)/,
  }
};
