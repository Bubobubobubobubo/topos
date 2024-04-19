/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.html", "./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      black: "rgb(var(--black) / <alpha-value>)",
      red: "rgb(var(--red) / <alpha-value>)",
      green: "rgb(var(--green) / <alpha-value>)",
      yellow: "rgb(var(--yellow) / <alpha-value>)",
      blue: "rgb(var(--blue) / <alpha-value>)",
      magenta: "rgb(var(--magenta) / <alpha-value>)",
      cyan: "rgb(var(--cyan) / <alpha-value>)",
      white: "rgb(var(--white) / <alpha-value>)",
      brightblack: "rgb(var(--brightblack) / <alpha-value>)",
      brightred: "rgb(var(--brightred) / <alpha-value>)",
      brightgreen: "rgb(var(--brightgreen) / <alpha-value>)",
      brightyellow: "rgb(var(--brightyellow) / <alpha-value>)",
      brightblue: "rgb(var(--brightblue) / <alpha-value>)",
      brightmagenta: "rgb(var(--brightmagenta) / <alpha-value>)",
      brightcyan: "rgb(var(--brightcyan) / <alpha-value>)",
      brightwhite: "rgb(var(--brightwhite) / <alpha-value>)",
      background: "rgb(var(--background) / <alpha-value>)",
      selection_foreground: "rgb(var(--selection_foreground) / <alpha-value>)",
      cursor: "rgb(var(--cursor) / <alpha-value>)",
      foreground: "rgb(var(--foreground) / <alpha-value>)",
      selection_background: "rgb(var(--selection_background) / <alpha-value>)",
    }
  },
  extend: {},
  safelist: [{
    pattern: /(bg|text|border)-(transparent|color0|color1|color2|color3|color4|color5|color6|color7|color8|color9|color10|color11|color12|color13|color14|color15|background|selection_background|cursor|foreground|selection_background)/,
  }],
};
