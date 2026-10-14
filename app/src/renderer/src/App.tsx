import { useCallback, useEffect, useState } from "react";
import { Editor } from "./Editor";
import { Icon } from "./icons";
import { Roadmap } from "./Roadmap";
import { ProblemPanel, TestPanel } from "./Today";
import { Tutor } from "./Tutor";
import type { Roadmap as RoadmapData, Session, TestEvent } from "./types";

type View = "today" | "roadmap";

export function App() {
  const [view, setView] = useState<View>("today");
  const [session, setSession] = useState<Session | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [test, setTest] = useState<TestEvent | null>(null);
  const [file, setFile] = useState("");

  const refresh = useCallback(() => {
    void window.tp.engine("session").then((s) => setSession(s as Session));
    void window.tp.engine("roadmap").then((r) => setRoadmap(r as RoadmapData));
  }, []);

  useEffect(() => {
    refresh();
    const offChanged = window.tp.onEngineChanged(refresh);
    const offTest = window.tp.onTestEvent((event) => setTest(event as TestEvent));
    return () => {
      offChanged();
      offTest();
    };
  }, [refresh]);

  // A new problem starts with a clean test panel.
  const slug = session?.problem?.slug;
  useEffect(() => setTest(null), [slug]);

  const show = useCallback((next: View) => {
    setView(next);
    if (next === "today") requestAnimationFrame(() => window.dispatchEvent(new Event("tp:focus-editor")));
  }, []);

  // Cmd+1 Today, Cmd+2 Roadmap, Cmd+E the editor, Cmd+L the tutor.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.metaKey || e.shiftKey || e.altKey) return;
      const action = { "1": () => show("today"), "2": () => show("roadmap"), e: () => show("today"), l: () => {
        setView("today");
        requestAnimationFrame(() => window.dispatchEvent(new Event("tp:focus-tutor")));
      } }[e.key.toLowerCase()];
      if (action) {
        e.preventDefault();
        action();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [show]);

  return (
    <div className="app">
      <nav className="rail" aria-label="Main">
        <div className="mark">
          <Icon name="logo" />
        </div>
        <button className={`item${view === "today" ? " on" : ""}`} title="Today (⌘1)" aria-label="Today" onClick={() => show("today")}>
          <Icon name="today" />
        </button>
        <button className={`item${view === "roadmap" ? " on" : ""}`} title="Roadmap (⌘2)" aria-label="Roadmap" onClick={() => show("roadmap")}>
          <Icon name="map" />
        </button>
      </nav>

      {/* Today stays mounted so Neovim and the chat keep running while the roadmap is open. */}
      <main className={`view today${view === "today" ? " on" : ""}`}>
        <ProblemPanel session={session} file={file} />
        <div className="col">
          <Editor onFile={setFile} />
          <TestPanel test={test} />
        </div>
        <Tutor />
      </main>
      <main className={`view roadmap${view === "roadmap" ? " on" : ""}`}>
        {roadmap && <Roadmap data={roadmap} onContinue={() => show("today")} />}
      </main>
    </div>
  );
}
