import { contextBridge, ipcRenderer } from "electron";

function on<T>(channel: string, callback: (payload: T) => void): () => void {
  const listener = (_event: unknown, payload: T) => callback(payload);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

const api = {
  engine: (method: "session" | "roadmap") => ipcRenderer.invoke("engine", method),
  onEngineChanged: (callback: () => void) => on("engine:changed", callback),
  tutor: {
    start: () => ipcRenderer.send("tutor:start"),
    send: (text: string) => ipcRenderer.send("tutor:send", text),
    onEvent: (callback: (event: unknown) => void) => on("tutor:event", callback),
  },
};

export type Api = typeof api;
contextBridge.exposeInMainWorld("tp", api);
