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
  /** Call the engine bridge. The methods and their replies are listed in the renderer's types. */
  engine: (
    method:
      | "attempt.give_up"
      | "attempt.pause"
      | "code.read"
      | "code.run"
      | "code.save"
      | "code.submit"
      | "course"
      | "exercise.close"
      | "exercise.submit"
      | "lesson"
      | "lesson.open"
      | "lesson.peek"
      | "problem"
      | "review.next"
      | "reviews"
      | "session",
    params?: {
      slug?: string;
      text?: string;
      /** An exercise id. */
      id?: number;
      /** A concept id, for the lesson methods. */
      concept?: string;
      response?: string | string[];
    }
  ) => ipcRenderer.invoke("engine", method, params),
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
