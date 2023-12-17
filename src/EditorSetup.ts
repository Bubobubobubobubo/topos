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
import { javascript } from "@codemirror/lang-javascript";
import { inlineHoveringTips } from "./documentation/inlineHelp";
import { toposCompletions, soundCompletions } from "./documentation/inlineHelp";
import { javascriptLanguage } from "@codemirror/lang-javascript";

export const getCodeMirrorTheme = (theme: {[key: string]: string}): Extension => {
  // @ts-ignore
  const black = theme["black"],
        red = theme["red"],
        green = theme["green"],
        yellow = theme["yellow"],
        blue = theme["blue"],
        magenta = theme["magenta"],
        cyan = theme["cyan"],
        white = theme["white"],
        // @ts-ignore
        brightblack = theme["brightblack"],
        // @ts-ignore
        brightred = theme["brightred"],
        brightgreen = theme["brightgreen"],
        // @ts-ignore
        brightyellow = theme["brightyellow"],
        // @ts-ignore
        brightblue = theme["brightblue"],
        // @ts-ignore
        brightmagenta = theme["brightmagenta"],
        // @ts-ignore
        brightcyan = theme["brightcyan"],
        brightwhite = theme["brightwhite"],
        background = theme["background"],
        selection_foreground = theme["selection_foreground"],
        cursor = theme["cursor"],
        foreground = theme["foreground"],
        selection_background = theme["selection_background"];
  const toposTheme = EditorView.theme( {
      "&": {
        color: background,
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
          backgroundColor: brightwhite,
          border: `1px solid ${brightwhite}`,
        },
      ".cm-panels": {
        backgroundColor: selection_background,
        color: red,
      },
      ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
      ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },
      ".cm-search.cm-panel": { backgroundColor: "transparent" },
      ".cm-searchMatch": {
        outline: `1px solid ${magenta}`,
      },
      ".cm-searchMatch.cm-searchMatch-selected": {
        backgroundColor: red,
      },
      ".cm-activeLine": {
        backgroundColor: `rgba(${(parseInt(selection_background.slice(1,3), 16))}, ${(parseInt(selection_background.slice(3,5), 16))}, ${(parseInt(selection_background.slice(5,7), 16))}, 0.25)`,
      },
      ".cm-selectionMatch": {
        backgroundColor: `rgba(${(parseInt(selection_background.slice(1,3), 16))}, ${(parseInt(selection_background.slice(3,5), 16))}, ${(parseInt(selection_background.slice(5,7), 16))}, 0.25)`,
        outline: `1px solid ${brightwhite}`,
      },
      "&.cm-focused .cm-matchingBracket": {
        color: `rgba(${(parseInt(selection_background.slice(1,3), 16))}, ${(parseInt(selection_background.slice(3,5), 16))}, ${(parseInt(selection_background.slice(5,7), 16))}, 0.25)`,
      },
      "&.cm-focused .cm-nonmatchingBracket": {
        color: yellow,
      },

      ".cm-gutters": {
        //backgroundColor: base00,
        backgroundColor: "transparent",
        color: foreground,
      },
      ".cm-activeLineGutter": {
        backgroundColor: selection_background,
        color: selection_foreground,
      },

      ".cm-foldPlaceholder": {
        border: "none",
        color: `${blue}`,
      },
      ".cm-tooltip": {
        border: "none",
        backgroundColor: background,
      },
      ".cm-tooltip .cm-tooltip-arrow:before": {},
      ".cm-tooltip .cm-tooltip-arrow:after": {
        borderTopColor: background,
        borderBottomColor: background,
      },
      ".cm-tooltip-autocomplete": {
        "& > ul > li[aria-selected]": {
          backgroundColor: background,
          color: background,
        },
      },
    },
    { dark: true },
  );

  let toposHighlightStyle = HighlightStyle.define([
    { tag: t.paren, color: brightwhite },
    { tag: [t.propertyName, t.punctuation, t.variableName], color: brightwhite },
    { tag: t.keyword, color: yellow },
    { tag: [t.name, t.deleted, t.character, t.macroName], color: red, },
    { tag: [t.function(t.variableName)], color: blue },
    { tag: [t.labelName], color: brightwhite },
    { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: cyan, },
    { tag: [t.definition(t.name), t.separator], color: brightwhite },
    { tag: [t.brace], color: white },
    { tag: [t.annotation], color: blue, },
    { tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: yellow, },
    { tag: [t.typeName, t.className], color: magenta, },
    { tag: [t.operator, t.operatorKeyword], color: blue, },
    { tag: [t.tagName], color: blue, },
    { tag: [t.squareBracket], color: blue, },
    { tag: [t.angleBracket], color: blue, },
    { tag: [t.attributeName], color: red, },
    { tag: [t.regexp], color: brightgreen, },
    { tag: [t.quote], color: green, },
    { tag: [t.string], color: green },
    {
      tag: t.link,
      color: green,
      textDecoration: "underline",
      textUnderlinePosition: "under",
    },
    {
      tag: [t.url, t.escape, t.special(t.string)],
      color: green,
    },
    { tag: [t.meta], color: brightwhite },
    { tag: [t.comment], color: brightwhite, fontStyle: "italic" },
    { tag: t.monospace, color: brightwhite },
    { tag: t.strong, fontWeight: "bold", color: white },
    { tag: t.emphasis, fontStyle: "italic", color: white },
    { tag: t.strikethrough, textDecoration: "line-through" },
    { tag: t.heading, fontWeight: "bold", color: white },
    { tag: t.heading1, fontWeight: "bold", color: white },
    {
      tag: [t.heading2, t.heading3, t.heading4],
      fontWeight: "bold",
      color: yellow,
    },
    {
      tag: [t.heading5, t.heading6],
      color: red,
    },
    { tag: [t.atom, t.bool, t.special(t.variableName)], color: green},
    {
      tag: [t.processingInstruction, t.inserted],
      color: green,
    },
    {
      tag: [t.contentSeparator],
      color: green,
    },
    { tag: t.invalid, color: red, borderBottom: `1px dotted ${red}` },
  ]);
  return [ toposTheme, syntaxHighlighting(toposHighlightStyle),
]
}

// const debugTheme = EditorView.theme({
//   ".cm-line span": {
//     position: "relative",
//   },
//   ".cm-line span:hover::after": {
//     position: "absolute",
//     bottom: "100%",
//     left: 0,
//     background: "black",
//     color: "white",
//     border: "solid 2px",
//     borderRadius: "5px",
//     content: "var(--tags)",
//     width: `max-content`,
//     padding: "1px 4px",
//     zIndex: 10,
//     pointerEvents: "none",
//   },
// });
// 
// const debugHighlightStyle = HighlightStyle.define(
//   // @ts-ignore
//   Object.entries(t).map(([key, value]) => {
//     return { tag: value, "--tags": `"tag.${key}"` };
//   })
// );
// const debug = [debugTheme, syntaxHighlighting(debugHighlightStyle)];


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
  app.themeCompartment = new Compartment();
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
    app.themeCompartment.of(
      getCodeMirrorTheme(app.getColorScheme("Tomorrow Night Burns")),
      // debug
    ),
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
