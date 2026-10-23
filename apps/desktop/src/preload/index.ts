import { contextBridge, ipcRenderer } from "electron";
import type { IpcRendererEvent } from "electron";

import type { TutorEvent } from "../main/tutor";

const on = <T>(
  channel: string,
  handler: (payload: T) => void
): (() => void) => {
  const listener = (_event: IpcRendererEvent, payload: T) => handler(payload);
  ipcRenderer.on(channel, listener);

  return () => ipcRenderer.removeListener(channel, listener);
};

const api = {
  engine: (
    method: "session" | "roadmap" | "problem",
    params?: { slug: string }
  ) => ipcRenderer.invoke("engine", method, params),
  onEngineChanged: (handler: () => void) => on("engine:changed", handler),
  tutor: {
    onEvent: (handler: (event: TutorEvent) => void) =>
      on("tutor:event", handler),
    send: (text: string) => ipcRenderer.send("tutor:send", text),
    start: () => ipcRenderer.send("tutor:start"),
  },
};

export type Api = typeof api;

contextBridge.exposeInMainWorld("tp", api);
