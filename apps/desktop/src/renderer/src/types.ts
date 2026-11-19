import type { Api } from "../../preload/index";

declare global {
  interface Window {
    tp: Api;
  }
}

export type * from "@tech-prep/engine/contract";
