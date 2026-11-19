import type { Method, Methods } from "@tech-prep/engine/contract";
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
  /** Call the engine bridge. The contract lists every method, what it takes and what it answers. */
  engine: <M extends Method>(
    method: M,
    ...params: Methods[M]["params"] extends undefined
      ? [params?: Methods[M]["params"]]
      : [params: Methods[M]["params"]]
  ): Promise<Methods[M]["result"]> =>
    ipcRenderer.invoke("engine", method, params[0]),
  onEngineChanged: (handler: () => void) => on("engine:changed", handler),
  tutor: {
    /** Tell the tutor what happened in the app. It is not shown as a learner message. */
    notify: (text: string) => ipcRenderer.send("tutor:send", `[app] ${text}`),
    onEvent: (handler: (event: TutorEvent) => void) =>
      on("tutor:event", handler),
    send: (text: string) => ipcRenderer.send("tutor:send", text),
    start: () => ipcRenderer.send("tutor:start"),
  },
};

export type Api = typeof api;

contextBridge.exposeInMainWorld("tp", api);
