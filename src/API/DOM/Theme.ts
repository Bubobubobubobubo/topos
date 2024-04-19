import { type Editor } from '../../main';
import colorschemes from "../../Editor/colors.json";

export const theme = (app: Editor) => (color_scheme: string): void => {
  app.readTheme(color_scheme);
};

export const themeName = (app: Editor) => (): string => {
  return app.currentThemeName;
};

export const randomTheme = (app: Editor) => (): void => {
  let theme_names = getThemes()();
  let selected_theme = theme_names[Math.floor(Math.random() * theme_names.length)];
  app.readTheme(selected_theme);
};

export const nextTheme = (app: Editor) => (): void => {
  let theme_names = getThemes()();
  let current_theme = themeName(app)();
  let current_theme_idx = theme_names.indexOf(current_theme);
  let next_theme_idx = (current_theme_idx + 1) % theme_names.length;
  let next_theme = theme_names[next_theme_idx];
  app.readTheme(next_theme);
  app.api.log(next_theme);
};

export const getThemes = () => (): string[] => {
  return Object.keys(colorschemes);
};
