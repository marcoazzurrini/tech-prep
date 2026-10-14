import { FitAddon } from "@xterm/addon-fit";
import { WebglAddon } from "@xterm/addon-webgl";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

const FONT = '"JetBrains Mono", "Symbols Nerd Font Mono", Menlo, monospace';

/** The learner's Neovim, drawn with xterm.js. The file name comes from Neovim's title. */
export function Editor({ onFile }: { onFile: (name: string) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const [file, setFile] = useState("");
  const [ended, setEnded] = useState<string | false>(false);

  useEffect(() => {
    const t = new Terminal({
      fontFamily: FONT,
      fontSize: 14,
      lineHeight: 1.2,
      macOptionIsMeta: true,
      scrollback: 0,
      theme: {
        background: "#202020",
        foreground: "#d4d7dd",
        cursor: "#eff1f6",
        cursorAccent: "#202020",
        selectionBackground: "rgba(255, 161, 22, 0.35)",
      },
    });
    const fit = new FitAddon();
    t.loadAddon(fit);
    term.current = t;
    let disposed = false;

    const resize = () => {
      if (!t.element || !host.current?.offsetWidth) return;
      fit.fit();
      window.tp.nvim.resize(t.cols, t.rows);
    };

    // Measure the font only after it has loaded, or the cell grid comes out wrong.
    void Promise.all([
      document.fonts.load('14px "JetBrains Mono"'),
      document.fonts.load('14px "Symbols Nerd Font Mono"', "\ue5ff"),
    ]).finally(() => {
      if (disposed || !host.current) return;
      t.open(host.current);
      try {
        t.loadAddon(new WebglAddon());
      } catch {
        // The DOM renderer is slower but fine.
      }
      resize();
      t.focus();
    });

    // Cmd shortcuts belong to the app (Cmd+1, Cmd+L, copy and paste), not to Neovim.
    t.attachCustomKeyEventHandler((e) => !e.metaKey);
    t.onData((data) => window.tp.nvim.input(data));
    t.onTitleChange((title) => {
      setFile(title);
      onFile(title);
    });
    const offData = window.tp.nvim.onData((data) => t.write(data));
    const offExit = window.tp.nvim.onExit((error) => setEnded(error ?? "Neovim has closed."));
    const observer = new ResizeObserver(resize);
    observer.observe(host.current!);
    const focus = () => t.focus();
    window.addEventListener("tp:focus-editor", focus);

    return () => {
      disposed = true;
      observer.disconnect();
      offData();
      offExit();
      window.removeEventListener("tp:focus-editor", focus);
      t.dispose();
    };
  }, [onFile]);

  const restart = () => {
    const t = term.current;
    if (!t) return;
    t.reset();
    setEnded(false);
    // Resizing with no Neovim running starts a new one at this size.
    window.tp.nvim.resize(t.cols, t.rows);
    t.focus();
  };

  return (
    <section className="panel ed">
      <div className="ph">
        <Icon name="code" />
        {file || "Neovim"}
        <span className="aside">Neovim</span>
      </div>
      <div className="term" ref={host} />
      {ended && (
        <div className="ended">
          <span>{ended}</span>
          <button className="btn quiet" onClick={restart}>
            Open Neovim again
          </button>
        </div>
      )}
    </section>
  );
}
