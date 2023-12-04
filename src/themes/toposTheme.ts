import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

const base00 = "#262626",
  base01 = "#3B4252",
  base02 = "#BBBBBB",
  base03 = "#4C566A",
  base04 = "#D8DEE9",
  base05 = "#E5E9F0",
  base07 = "#8FBCBB",
  base_red = "#BF616A",
  base_deeporange = "#D08770",
  base_pink = "#B48EAD",
  base_cyan = "#FBCF8B",
  base_yellow = "#88C0D0",
  base_orange = "#D08770",
  base_indigo = "#5E81AC",
  base_purple = "#B48EAD",
  base_green = "#A3BE8C",
  base_lightgreen = "#A3BE8C";

const invalid = base_red,
  darkBackground = "#262626",
  highlightBackground = "#252525",
  // background = base00,
  tooltipBackground = base01,
  cursor = base04;

/// The editor theme styles for Material Dark.
export const toposDarkTheme = EditorView.theme(
  {
    "&": {
      color: base05,
      // backgroundColor: background,
      backgroundColor: "transparent",
      fontSize: "24px",
      fontFamily: "IBM Plex Mono",
    },
    ".cm-content": {
      caretColor: cursor,
      fontFamily: "IBM Plex Mono",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: cursor,
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      {
        backgroundColor: base00,
        border: `0.5px solid ${base00}`,
      },
    ".cm-panels": {
      backgroundColor: darkBackground,
      color: base05,
    },
    ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
    ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },
    ".cm-search.cm-panel": { backgroundColor: "transparent" },
    ".cm-searchMatch": {
      outline: `1px solid ${base_cyan}`,
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: highlightBackground,
    },
    ".cm-activeLine": {
      // backgroundColor: highlightBackground
      backgroundColor: "rgb(76,76,106, 0.1)",
    },
    ".cm-selectionMatch": {
      backgroundColor: base04,
      outline: `1px solid ${base_red}`,
    },

    "&.cm-focused .cm-matchingBracket": {
      color: base02,
      // outline: `1px solid ${base02}`,
    },

    "&.cm-focused .cm-nonmatchingBracket": {
      color: base_red,
    },

    ".cm-gutters": {
      //backgroundColor: base00,
      backgroundColor: "transparent",
      color: base02,
    },

    ".cm-activeLineGutter": {
      backgroundColor: highlightBackground,
      color: base02,
    },

    ".cm-foldPlaceholder": {
      border: "none",
      color: `${base07}`,
    },

    ".cm-tooltip": {
      border: "none",
      backgroundColor: tooltipBackground,
    },
    ".cm-tooltip .cm-tooltip-arrow:before": {},
    ".cm-tooltip .cm-tooltip-arrow:after": {
      borderTopColor: tooltipBackground,
      borderBottomColor: tooltipBackground,
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: highlightBackground,
        color: base03,
      },
    },
  },
  { dark: true },
);

/// The highlighting style for code in the Material Dark theme.
export const toposDarkHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: base_purple },
  {
    tag: [t.name, t.deleted, t.character, t.macroName],
    color: base_cyan,
  },
  { tag: [t.propertyName], color: base_yellow },
  { tag: [t.variableName], color: base05 },
  { tag: [t.function(t.variableName)], color: base_cyan },
  { tag: [t.labelName], color: base_purple },
  {
    tag: [t.color, t.constant(t.name), t.standard(t.name)],
    color: base_yellow,
  },
  { tag: [t.definition(t.name), t.separator], color: base_pink },
  { tag: [t.brace], color: base_purple },
  {
    tag: [t.annotation],
    color: invalid,
  },
  {
    tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
    color: base_orange,
  },
  {
    tag: [t.typeName, t.className],
    color: base_orange,
  },
  {
    tag: [t.operator, t.operatorKeyword],
    color: base_indigo,
  },
  {
    tag: [t.tagName],
    color: base_deeporange,
  },
  {
    tag: [t.squareBracket],
    color: base_red,
  },
  {
    tag: [t.angleBracket],
    color: base02,
  },
  {
    tag: [t.attributeName],
    color: base05,
  },
  {
    tag: [t.regexp],
    color: invalid,
  },
  {
    tag: [t.quote],
    color: base_green,
  },
  { tag: [t.string], color: base_lightgreen },
  {
    tag: t.link,
    color: base_cyan,
    textDecoration: "underline",
    textUnderlinePosition: "under",
  },
  {
    tag: [t.url, t.escape, t.special(t.string)],
    color: base_yellow,
  },
  { tag: [t.meta], color: base03 },
  { tag: [t.comment], color: base02, fontStyle: "italic" },
  { tag: t.monospace, color: base05 },
  { tag: t.strong, fontWeight: "bold", color: base_red },
  { tag: t.emphasis, fontStyle: "italic", color: base_lightgreen },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.heading, fontWeight: "bold", color: base_yellow },
  { tag: t.heading1, fontWeight: "bold", color: base_yellow },
  {
    tag: [t.heading2, t.heading3, t.heading4],
    fontWeight: "bold",
    color: base_yellow,
  },
  {
    tag: [t.heading5, t.heading6],
    color: base_yellow,
  },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: base_cyan },
  {
    tag: [t.processingInstruction, t.inserted],
    color: base_red,
  },
  {
    tag: [t.contentSeparator],
    color: base_cyan,
  },
  { tag: t.invalid, color: base02, borderBottom: `1px dotted ${base_red}` },
]);

/// Extension to enable the Material Dark theme (both the editor theme and
/// the highlight style).
export const toposTheme: Extension = [
  toposDarkTheme,
  syntaxHighlighting(toposDarkHighlightStyle),
];
