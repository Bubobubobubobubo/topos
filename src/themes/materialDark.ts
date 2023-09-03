import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

const base00 = "#353535",
  base01 = "#3D3D3D",
  base02 = "#FEFEFE",
  base03 = "#656565",
  base04 = "#797979",
  base05 = "#8D8D8D",
  base06 = "#A1A1A1",
  base07 = "#B5B5B5",
  base_red = "#D38185",
  base_deeporange = "#D8A094",
  base_pink = "#D0AEB7",
  base_yellow = "#EEDC93",
  base_orange = "#D8A094",
  base_cyan = "#6292B2",
  base_indigo = "#92C8D8",
  base_purple = "#CAB0C7",
  base_green = "#ADC390",
  base_lightgreen = "#ADC390",
  base_teal = "#93CFC9";

// Good Nord palette
// const base00 = "#2E3440",
//   base01 = "#3B4252",
//   base02 = "#F0F0F0",
//   base03 = "#4C566A",
//   base04 = "#D8DEE9",
//   base05 = "#E5E9F0",
//   base06 = "#ECEFF4",
//   base07 = "#8FBCBB",
//   base_red = "#BF616A",
//   base_deeporange = "#D08770",
//   base_pink = "#B48EAD",
//   base_yellow = "#EBCB8B",
//   base_orange = "#D08770",
//   base_cyan = "#88C0D0",
//   base_indigo = "#5E81AC",
//   base_purple = "#B48EAD",
//   base_green = "#A3BE8C",
//   base_lightgreen = "#A3BE8C",
//   base_teal = "#8FBCBB";

const invalid = base_red,
  darkBackground = "#fdf6e3",
  highlightBackground = "#545b61",
  background = base00,
  tooltipBackground = base01,
  selection = base07,
  cursor = base04;

/// The editor theme styles for Material Dark.
export const materialDarkTheme = EditorView.theme(
  {
    "&": {
      color: base05,
      backgroundColor: background,
      fontSize: "48px",
      fontFamily: "'Victor Mono', monospace",
    },
    ".cm-content": {
      caretColor: cursor,
      fontFamily: "'Victor Mono', monospace",
    },
    ".cm-cursor, .cm-dropCursor": { borderLeftColor: cursor },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      { backgroundColor: base_deeporange, border: `0.5px solid ${base_red}` },
    ".cm-panels": { backgroundColor: darkBackground, color: base05 },
    ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
    ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },
    ".cm-searchMatch": {
      outline: `1px solid ${base_yellow}`,
      backgroundColor: "transparent",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: highlightBackground,
    },

    ".cm-activeLine": { backgroundColor: highlightBackground },
    ".cm-selectionMatch": {
      backgroundColor: darkBackground,
      outline: `1px solid ${base_red}`,
    },

    "&.cm-focused .cm-matchingBracket": {
      color: base06,
      outline: `1px solid ${base_red}`,
    },

    "&.cm-focused .cm-nonmatchingBracket": {
      color: base_red,
    },

    ".cm-gutters": {
      backgroundColor: base00,
      borderRight: `1px solid ${base07}`,
      color: base02,
    },

    ".cm-activeLineGutter": {
      backgroundColor: highlightBackground,
      color: base07,
    },

    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: `${base07}`,
    },

    ".cm-tooltip": {
      border: "none",
      backgroundColor: tooltipBackground,
    },
    ".cm-tooltip .cm-tooltip-arrow:before": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
    },
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
  { dark: true }
);

/// The highlighting style for code in the Material Dark theme.
export const materialDarkHighlightStyle = HighlightStyle.define([
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
export const materialDark: Extension = [
  materialDarkTheme,
  syntaxHighlighting(materialDarkHighlightStyle),
];
