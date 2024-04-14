import { type Editor } from "../main";
import { vim } from "@replit/codemirror-vim";
import { tryEvaluate } from "../Evaluator";
import { hideDocumentation, showDocumentation } from "../documentation/Documentation";
import { openSettingsModal, openUniverseModal } from "../FileManagement";

export const registerFillKeys = (app: Editor) => {
  document.addEventListener("keydown", (event) => {
    if (event.altKey) {
      app.fill = true;
      app.interface.fill_viewer.classList.remove("invisible");
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "Alt") {
      app.fill = false;
      app.interface.fill_viewer.classList.add("invisible");
    }
  });
};

export const registerOnKeyDown = (app: Editor) => {
  window.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
    }

    if (event.ctrlKey && event.key === "m") {
      event.preventDefault();
      let topbar = document.getElementById("topbar");
      let sidebar = document.getElementById("sidebar");
      console.log("oui ok");
      if (app.hidden_interface) {
        // Sidebar
        sidebar?.classList.remove("flex");
        sidebar?.classList.remove("flex-col");
        sidebar?.classList.add("hidden");
        // Topbar
        topbar?.classList.add("hidden");
        topbar?.classList.remove("flex");
      } else {
        // Sidebar
        sidebar?.classList.remove("hidden");
        sidebar?.classList.add("flex");
        sidebar?.classList.add("flex-col");
        // Topbar
        topbar?.classList.remove("hidden");
        topbar?.classList.add("flex");
      }
      app.hidden_interface = !app.hidden_interface;
    }

    if (event.ctrlKey && event.key === "s") {
      event.preventDefault();
      app.setButtonHighlighting("stop", true);
      app.clock.stop();
    }

    if (event.ctrlKey && event.key === "p") {
      event.preventDefault();
      if (app.isPlaying) {
        app.isPlaying = false;
        app.setButtonHighlighting("pause", true);
        app.clock.pause();
      } else {
        app.isPlaying = true;
        app.setButtonHighlighting("play", true);
        app.clock.start();
      }
    }

    // Ctrl + Shift + V: Vim Mode
    if (
      (event.key === "v" || event.key === "V") &&
      event.ctrlKey &&
      event.shiftKey
    ) {
      app.settings.vimMode = !app.settings.vimMode;
      event.preventDefault();
      app.userPlugins = app.settings.vimMode ? [] : [vim()];
      app.view.dispatch({
        effects: app.dynamicPlugins.reconfigure(app.userPlugins),
      });
    }

    // Ctrl + Enter or Return: Evaluate
    if ((event.key === "Enter" || event.key === "Return") && event.ctrlKey) {
      event.preventDefault();
      app.currentFile().candidate = app.view.state.doc.toString();
      app.flashBackground("#404040", 200);
    }

    // Evaluate (bis)
    if (
      (event.key === "Enter" && event.shiftKey) ||
      (event.key === "e" && event.ctrlKey)
    ) {
      event.preventDefault(); // Prevents the addition of a new line
      app.currentFile().candidate = app.view.state.doc.toString();
      app.flashBackground("#404040", 200);
    }

    // Force evaluation
    if (event.key === "Enter" && event.shiftKey && event.ctrlKey) {
      event.preventDefault();
      app.currentFile().candidate = app.view.state.doc.toString();
      app.api.onceEvaluator = true;
      app.api.forceEvaluator = true;
      tryEvaluate(app, app.currentFile());
      app.flashBackground("#404040", 200);
    }

    // Force eval with clearing cache
    if (event.ctrlKey && event.shiftKey && (event.key === "Backspace" || event.key === "Delete")) {
      event.preventDefault();
      app.api.clearPatternCache();
      app.currentFile().candidate = app.view.state.doc.toString();
      app.api.forceEvaluator = true;
      tryEvaluate(app, app.currentFile());
      app.flashBackground("#404040", 200);
    }

    // app is the modal to switch between universes
    if (event.ctrlKey && event.key === "b") {
      event.preventDefault();
      hideDocumentation();
      app.updateKnownUniversesView();
      openUniverseModal();
    }

    // app is the modal that opens up the settings
    if (event.shiftKey && event.key === "Escape") {
      openSettingsModal();
    }

    if (event.ctrlKey && event.key === "l") {
      event.preventDefault();
      app.changeModeFromInterface("local");
      hideDocumentation();
      app.view.focus();
    }

    if (event.ctrlKey && event.key === "n") {
      event.preventDefault();
      app.changeModeFromInterface("notes");
      hideDocumentation();
      app.view.focus();
    }

    if (event.ctrlKey && event.key === "g") {
      event.preventDefault();
      app.changeModeFromInterface("global");
      hideDocumentation();
      app.view.focus();
    }

    if (event.ctrlKey && event.key === "i") {
      event.preventDefault();
      app.changeModeFromInterface("init");
      hideDocumentation();
      app.changeToLocalBuffer(0);
      app.view.focus();
    }

    if (event.ctrlKey && event.key === "d") {
      event.preventDefault();
      showDocumentation(app);
    }

    [112, 113, 114, 115, 116, 117, 118, 119, 120].forEach((keycode, index) => {
      if (event.keyCode === keycode) {
        event.preventDefault();
        if (event.ctrlKey) {
          app.api.script(keycode - 111);
        } else {
          app.changeModeFromInterface("local");
          app.changeToLocalBuffer(index);
          hideDocumentation();
        }
      }
    });

    if (event.keyCode == 121) {
      event.preventDefault();
      app.changeModeFromInterface("global");
      hideDocumentation();
    }
    if (event.keyCode == 122) {
      event.preventDefault();
      app.changeModeFromInterface("init");
      hideDocumentation();
    }
  });
};
