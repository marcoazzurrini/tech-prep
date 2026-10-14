import { closeSync, openSync, readSync, statSync, watch, writeFileSync } from "node:fs";
import { join } from "node:path";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import { Engine } from "./engine";
import { Neovim } from "./neovim";
import { ensureWorkspace, EVENTS_FILE } from "./paths";
import { Tutor } from "./tutor";

let window: BrowserWindow | null = null;
const send = (channel: string, payload?: unknown) => window?.webContents.send(channel, payload);

const engine = new Engine();
const neovim = new Neovim(
  (data) => send("nvim:data", data),
  (error) => send("nvim:exit", error),
);
const tutor = new Tutor(
  (event) => send("tutor:event", event),
  () => send("engine:changed"),
);

/** Forward the test runs that `tp test` appends to EVENTS_FILE, and pass their line to the tutor. */
function watchTestRuns(): void {
  writeFileSync(EVENTS_FILE, "");
  let offset = 0;
  watch(EVENTS_FILE, () => {
    const size = statSync(EVENTS_FILE).size;
    if (size <= offset) return;
    const buffer = Buffer.alloc(size - offset);
    const fd = openSync(EVENTS_FILE, "r");
    readSync(fd, buffer, 0, buffer.length, offset);
    closeSync(fd);
    const text = buffer.toString("utf8");
    const end = text.lastIndexOf("\n") + 1;
    offset += Buffer.byteLength(text.slice(0, end));
    for (const line of text.slice(0, end).split("\n").filter(Boolean)) {
      try {
        const event = JSON.parse(line) as { tutor?: string };
        send("test:event", event);
        if (event.tutor) tutor.send(event.tutor);
      } catch {
        // A partial or foreign line: skip it.
      }
    }
    send("engine:changed");
  });
}

function createWindow(): void {
  window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1180,
    minHeight: 720,
    backgroundColor: "#1a1a1a",
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 12, y: 16 },
    title: "tech-prep",
    webPreferences: {
      preload: join(import.meta.dirname, "../preload/index.mjs"),
      sandbox: false,
      contextIsolation: true,
    },
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
  if (process.env.ELECTRON_RENDERER_URL) void window.loadURL(process.env.ELECTRON_RENDERER_URL);
  else void window.loadFile(join(import.meta.dirname, "../renderer/index.html"));
  window.on("closed", () => (window = null));
  // For checking the layout from a script: TECHPREP_SCREENSHOT=/path/shot.png [TECHPREP_VIEW=roadmap]
  // saves a screenshot after a delay, then quits.
  const shot = process.env.TECHPREP_SCREENSHOT;
  if (shot) {
    setTimeout(async () => {
      if (process.env.TECHPREP_VIEW) await window?.webContents.executeJavaScript(`document.querySelector('[aria-label="${process.env.TECHPREP_VIEW === "roadmap" ? "Roadmap" : "Today"}"]').click()`);
      setTimeout(async () => {
        writeFileSync(shot, (await window!.webContents.capturePage()).toPNG());
        app.quit();
      }, 1500);
    }, Number(process.env.TECHPREP_SCREENSHOT_DELAY ?? 20000));
  }
}

ipcMain.handle("engine", (_event, method: string) => engine.request(method));
ipcMain.on("nvim:input", (_event, data: string) => neovim.write(data));
ipcMain.on("nvim:resize", (_event, cols: number, rows: number) => neovim.resize(cols, rows));
ipcMain.on("tutor:send", (_event, text: string) => tutor.send(text));
ipcMain.on("tutor:start", () => tutor.start());

app.whenReady().then(() => {
  ensureWorkspace();
  watchTestRuns();
  createWindow();
});

app.on("window-all-closed", () => app.quit());
app.on("will-quit", () => {
  neovim.stop();
  tutor.stop();
  engine.stop();
});
