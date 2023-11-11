import { Prec } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import {
  keymap,
  ViewUpdate,
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
} from "@codemirror/language";
import { defaultKeymap, historyKeymap, history } from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search"
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
import { javascriptLanguage } from "@codemirror/lang-javascript"

export const jsCompletions = javascriptLanguage.data.of({
  autocomplete: toposCompletions
})

export const toposSoundCompletions = javascriptLanguage.data.of({
  autocomplete: soundCompletions
})

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
    app.completionsCompartment.of(app.settings.completions ? [jsCompletions, toposSoundCompletions] : []),
    editorSetup,
    toposTheme,
    app.chosenLanguage.of(javascript()),
    EditorView.updateListener.of((v: ViewUpdate) => {
      v;
    }),
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
        ])
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
      })
    ),
  });
};
