import { Prec } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { tags as t } from "@lezer/highlight";
import {
  keymap,
  lineNumbers,
  highlightSpecialChars,
  drawSelection,
  highlightActiveLine,
  dropCursor,
  // rectangularSelection,
  // crosshairCursor,
  highlightActiveLineGutter,
} from "@codemirror/view";
import { Extension, EditorState } from "@codemirror/state";
import { vim } from "@replit/codemirror-vim";
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
  bracketMatching,
  HighlightStyle,
} from "@codemirror/language";
import { defaultKeymap, historyKeymap, history } from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { lintKeymap } from "@codemirror/lint";
import { Compartment } from "@codemirror/state";
import { Editor } from "./main";
import { EditorView } from "codemirror";
import { toposTheme } from "./themes/toposTheme";
import { javascript } from "@codemirror/lang-javascript";
import { inlineHoveringTips } from "./documentation/inlineHelp";
import { toposCompletions, soundCompletions } from "./documentation/inlineHelp";
import { javascriptLanguage } from "@codemirror/lang-javascript";

export const updateCodeMirrorTheme = (theme: {[key: string]: string}): Extension => {
  const color0 = theme["color0"],
        color1 = theme["color1"],
        color2 = theme["color2"],
        color3 = theme["color3"],
        color4 = theme["color4"],
        color5 = theme["color5"],
        color6 = theme["color6"],
        color7 = theme["color7"],
        color8 = theme["color8"],
        color9 = theme["color9"],
        color10 = theme["color10"],
        color11 = theme["color11"],
        color12 = theme["color12"],
        color13 = theme["color13"],
        color14 = theme["color14"],
        color15 = theme["color15"];
  const toposTheme = EditorView.theme( {
      "&": {
        color: color5,
        // backgroundColor: background,
        backgroundColor: "transparent",
        fontSize: "24px",
        fontFamily: "IBM Plex Mono",
      },
      ".cm-content": {
        caretColor: color6,
        fontFamily: "IBM Plex Mono",
      },
      ".cm-cursor, .cm-dropCursor": {
        borderLeftColor: color6,
      },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
        {
          backgroundColor: color0,
          border: `0.5px solid ${color0}`,
        },
      ".cm-panels": {
        backgroundColor: color0,
        color: color4,
      },
      ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
      ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },
      ".cm-search.cm-panel": { backgroundColor: "transparent" },
      ".cm-searchMatch": {
        outline: `1px solid ${color3}`,
      },
      ".cm-searchMatch.cm-searchMatch-selected": {
        backgroundColor: color0,
      },
      ".cm-activeLine": {
        // backgroundColor: highlightBackground
        backgroundColor: "rgb(76,76,106, 0.1)",
      },
      ".cm-selectionMatch": {
        backgroundColor: color4,
        outline: `1px solid ${color10}`,
      },
      "&.cm-focused .cm-matchingBracket": {
        color: color2,
        // outline: `1px solid ${base02}`,
      },

      "&.cm-focused .cm-nonmatchingBracket": {
        color: color3,
      },

      ".cm-gutters": {
        //backgroundColor: base00,
        backgroundColor: "transparent",
        color: color4,
      },
      ".cm-activeLineGutter": {
        backgroundColor: color0,
        color: color2,
      },

      ".cm-foldPlaceholder": {
        border: "none",
        color: `${color7}`,
      },
      ".cm-tooltip": {
        border: "none",
        backgroundColor: color12,
      },
      ".cm-tooltip .cm-tooltip-arrow:before": {},
      ".cm-tooltip .cm-tooltip-arrow:after": {
        borderTopColor: color13,
        borderBottomColor: color14,
      },
      ".cm-tooltip-autocomplete": {
        "& > ul > li[aria-selected]": {
          backgroundColor: color0,
          color: color3,
        },
      },
    },
    { dark: true },
  );

  let toposHighlightStyle = HighlightStyle.define([
    { tag: t.keyword, color: color3 },
    {
      tag: [t.name, t.deleted, t.character, t.macroName],
      color: color2,
    },
    { tag: [t.propertyName], color: color4 },
    { tag: [t.variableName], color: color5 },
    { tag: [t.function(t.variableName)], color: color2 },
    { tag: [t.labelName], color: color3 },
    {
      tag: [t.color, t.constant(t.name), t.standard(t.name)],
      color: color4,
    },
    { tag: [t.definition(t.name), t.separator], color: color6 },
    { tag: [t.brace], color: color3 },
    {
      tag: [t.annotation],
      color: color10,
    },
    {
      tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
      color: color7,
    },
    {
      tag: [t.typeName, t.className],
      color: color7,
    },
    {
      tag: [t.operator, t.operatorKeyword],
      color: color8,
    },
    {
      tag: [t.tagName],
      color: color7,
    },
    {
      tag: [t.squareBracket],
      color: color13,
    },
    {
      tag: [t.angleBracket],
      color: color2,
    },
    {
      tag: [t.attributeName],
      color: color5,
    },
    {
      tag: [t.regexp],
      color: color4,
    },
    {
      tag: [t.quote],
      color: color4,
    },
    { tag: [t.string], color: color14 },
    {
      tag: t.link,
      color: color4,
      textDecoration: "underline",
      textUnderlinePosition: "under",
    },
    {
      tag: [t.url, t.escape, t.special(t.string)],
      color: color5,
    },
    { tag: [t.meta], color: color2 },
    { tag: [t.comment], color: color2, fontStyle: "italic" },
    { tag: t.monospace, color: color5 },
    { tag: t.strong, fontWeight: "bold", color: color4 },
    { tag: t.emphasis, fontStyle: "italic", color: color10 },
    { tag: t.strikethrough, textDecoration: "line-through" },
    { tag: t.heading, fontWeight: "bold", color: color5 },
    { tag: t.heading1, fontWeight: "bold", color: color5 },
    {
      tag: [t.heading2, t.heading3, t.heading4],
      fontWeight: "bold",
      color: color4,
    },
    {
      tag: [t.heading5, t.heading6],
      color: color4,
    },
    { tag: [t.atom, t.bool, t.special(t.variableName)], color: color2 },
    {
      tag: [t.processingInstruction, t.inserted],
      color: color3,
    },
    {
      tag: [t.contentSeparator],
      color: color3,
    },
    { tag: t.invalid, color: color2, borderBottom: `1px dotted ${color3}` },
  ]);
  return [ toposTheme, syntaxHighlighting(toposHighlightStyle),
]
}

export const jsCompletions = javascriptLanguage.data.of({
  autocomplete: toposCompletions,
});

export const toposSoundCompletions = javascriptLanguage.data.of({
  autocomplete: soundCompletions,
});

export const editorSetup: Extension = (() => [
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...searchKeymap,
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...historyKeymap,
    ...lintKeymap,
  ]),
])();

export const installEditor = (app: Editor) => {
  app.vimModeCompartment = new Compartment();
  app.hoveringCompartment = new Compartment();
  app.completionsCompartment = new Compartment();
  app.withLineNumbers = new Compartment();
  app.chosenLanguage = new Compartment();
  app.fontSize = new Compartment();
  const vimPlugin = app.settings.vimMode ? vim() : [];
  const lines = app.settings.line_numbers ? lineNumbers() : [];

  const fontModif = EditorView.theme({
    "&": {
      fontSize: `${app.settings.font_size}px`,
    },
    $content: {
      fontFamily: `${app.settings.font}`,
      fontSize: `${app.settings.font_size}px`,
    },
    ".cm-gutters": {
      fontSize: `${app.settings.font_size}px`,
    },
  });

  app.editorExtensions = [
    app.vimModeCompartment.of(vimPlugin),
    app.withLineNumbers.of(lines),
    app.fontSize.of(fontModif),
    app.hoveringCompartment.of(app.settings.tips ? inlineHoveringTips : []),
    app.completionsCompartment.of(
      app.settings.completions ? [jsCompletions, toposSoundCompletions] : [],
    ),
    editorSetup,
    toposTheme,
    app.chosenLanguage.of(javascript()),
  ];
  app.dynamicPlugins = new Compartment();
  app.state = EditorState.create({
    extensions: [
      ...app.editorExtensions,
      EditorView.lineWrapping,
      app.dynamicPlugins.of(app.userPlugins),
      Prec.highest(
        keymap.of([
          {
            key: "Ctrl-Enter",
            run: () => {
              return true;
            },
          },
        ]),
      ),
      keymap.of([indentWithTab]),
    ],
    doc: app.universes[app.selected_universe].global.candidate,
  });
  app.view = new EditorView({
    parent: document.getElementById("editor") as HTMLElement,
    state: app.state,
  });

  // Re-apply font size and font family change
  app.view.dispatch({
    effects: app.fontSize.reconfigure(
      EditorView.theme({
        "&": {
          fontSize: `${app.settings.font_size}px`,
        },
        $content: {
          fontFamily: `${app.settings.font}`,
          fontSize: `${app.settings.font_size}px`,
        },
        ".cm-gutters": {
          fontSize: `${app.settings.font_size}px`,
        },
      }),
    ),
  });
};
