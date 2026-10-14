import { writeFileSync } from "node:fs";
import path from "node:path";

import { app, BrowserWindow, ipcMain, shell } from "electron";

import { Engine } from "./engine";
import { ensureWorkspace } from "./paths";
import { Tutor } from "./tutor";
import type { TutorEvent } from "./tutor";

let window: BrowserWindow | null = null;

const send = (channel: string, payload?: TutorEvent) =>
  window?.webContents.send(channel, payload);

const engine = new Engine();

const tutor = new Tutor(
  (event) => send("tutor:event", event),
  () => send("engine:changed")
);

const createWindow = (): void => {
  window = new BrowserWindow({
    backgroundColor: "#1a1a1a",
    height: 900,
    minHeight: 720,
    minWidth: 1180,
    title: "tech-prep",
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 12, y: 16 },
    webPreferences: {
      contextIsolation: true,
      preload: path.join(import.meta.dirname, "../preload/index.mjs"),
      sandbox: false,
    },
    width: 1440,
  });
  // Links in tutor messages open in the browser, never inside the app.
  window.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);

    return { action: "deny" };
  });
  window.webContents.on("will-navigate", (event, url) => {
    if (url !== window?.webContents.getURL()) {
      event.preventDefault();
      void shell.openExternal(url);
    }
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    void window.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    void window.loadFile(
      path.join(import.meta.dirname, "../renderer/index.html")
    );
  }

  window.on("closed", () => (window = null));
  // For checking the layout from a script: TECHPREP_SCREENSHOT=/path/shot.png [TECHPREP_VIEW=roadmap]
  // saves a screenshot after a delay, then quits.
  const shot = process.env.TECHPREP_SCREENSHOT;

  if (shot) {
    setTimeout(
      async () => {
        if (process.env.TECHPREP_VIEW) {
          await window?.webContents.executeJavaScript(
            `document.querySelector('[aria-label="${process.env.TECHPREP_VIEW === "roadmap" ? "Roadmap" : "Today"}"]').click()`
          );
        }

        setTimeout(async () => {
          if (!window) {
            return;
          }

          const image = await window.webContents.capturePage();
          writeFileSync(shot, image.toPNG());
          app.quit();
        }, 1500);
      },
      Number(process.env.TECHPREP_SCREENSHOT_DELAY ?? 20_000)
    );
  }
};

ipcMain.handle("engine", (_event, method: string) => engine.request(method));

ipcMain.on("tutor:send", (_event, text: string) => tutor.send(text));

ipcMain.on("tutor:start", () => tutor.start());

const launch = async (): Promise<void> => {
  await app.whenReady();
  ensureWorkspace();
  createWindow();
};

void launch();

app.on("window-all-closed", () => app.quit());

app.on("will-quit", () => {
  tutor.stop();
  engine.stop();
});
