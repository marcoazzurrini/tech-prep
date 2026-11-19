import "@tech-prep/ui/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app";
import { Failure } from "./failure";

import "./styles.css";

const root = document.querySelector("#root");

if (!root) {
  throw new Error("index.html has no #root element.");
}

createRoot(root).render(
  <StrictMode>
    <Failure>
      <App />
    </Failure>
  </StrictMode>
);
