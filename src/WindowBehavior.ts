import { type Editor } from "./main";

export const installWindowBehaviors = (
  app: Editor,
  window: Window,
  preventMultipleTabs: boolean = false
) => {
  window.addEventListener("beforeunload", () => {
    // @ts-ignore
    event.preventDefault();
    // Iterate over all local files and set the candidate to the committed
    app.currentFile().candidate = app.view.state.doc.toString();
    app.currentFile().committed = app.view.state.doc.toString();
    app.settings.saveApplicationToLocalStorage(app.universes, app.settings);
    app.clock.stop();
    return null;
  });

  if (preventMultipleTabs) {
    localStorage.openpages = Date.now();
    window.addEventListener(
      "storage",
      function (e) {
        if (e.key == "openpages") {
          // Listen if anybody else is opening the same page!
          localStorage.page_available = Date.now();
        }
        if (e.key == "page_available") {
          document.getElementById("all")!.classList.add("invisible");
          alert(
            "Topos is already opened in another tab. Close this tab now to prevent data loss."
          );
        }
      },
      false
    );
  }
};
