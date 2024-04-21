import { type Editor } from "../main";
import { outputSocket, inputSocket } from "../IO/OSC";

const handleResize = (canvas: HTMLCanvasElement) => {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  // Assuming the canvas takes up the whole window
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  if (ctx) {
    ctx.scale(dpr, dpr);
  }
};

export const saveState = (app: Editor): null => {
  app.settings.saveApplicationToLocalStorage(app.universes, app.settings);
  return null;
};

export const saveBeforeExit = (app: Editor): null => {
  // Iterate over all local files and set the candidate to the committed
  app.currentFile().candidate = app.view.state.doc.toString();
  app.currentFile().committed = app.view.state.doc.toString();
  app.settings.saveApplicationToLocalStorage(app.universes, app.settings);
  // Close the websocket
  inputSocket.close();
  outputSocket.close();
  return null;
};

export const installWindowBehaviors = (
  app: Editor,
  window: Window,
  preventMultipleTabs: boolean = false,
) => {
  window.addEventListener("resize", () =>
    handleResize(app.interface.feedback as HTMLCanvasElement),
  );
  window.addEventListener("resize", () =>
    handleResize(app.interface.scope as HTMLCanvasElement),
  );
  // window.addEventListener("beforeunload", (event) => {
  //   event.preventDefault();
  //   saveBeforeExit(app);
  // });
  window.addEventListener("visibilitychange", (event) => {
    event.preventDefault();
    saveState(app);
  });

  if (preventMultipleTabs) {
    localStorage["openpages"] = Date.now();
    window.addEventListener(
      "storage",
      function(e) {
        if (e.key == "openpages") {
          // Listen if anybody else is opening the same page!
          localStorage["page_available"] = Date.now();
        }
        if (e.key == "page_available") {
          document.getElementById("all")!.classList.add("invisible");
          alert(
            "Topos is already opened in another tab. Close this tab now to prevent data loss.",
          );
        }
      },
      false,
    );
  }
};
