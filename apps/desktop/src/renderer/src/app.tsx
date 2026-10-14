import { useCallback, useEffect, useState } from "react";

import { Icon } from "./icons";
import { Roadmap } from "./roadmap";
import { ProblemPanel } from "./today";
import { Tutor } from "./tutor";
import type { Roadmap as RoadmapData, Session } from "./types";

type View = "today" | "roadmap";

export const App = () => {
  const [view, setView] = useState<View>("today");
  const [session, setSession] = useState<Session | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);

  const refresh = useCallback(() => {
    const loadSession = async () => {
      // SAFETY: the bridge's `session` method returns the engine's Session shape.
      setSession((await window.tp.engine("session")) as Session);
    };

    const loadRoadmap = async () => {
      // SAFETY: the bridge's `roadmap` method returns the engine's Roadmap shape.
      setRoadmap((await window.tp.engine("roadmap")) as RoadmapData);
    };

    void loadSession();
    void loadRoadmap();
  }, []);

  useEffect(() => {
    refresh();

    return window.tp.onEngineChanged(refresh);
  }, [refresh]);

  const show = useCallback((next: View) => setView(next), []);

  // Cmd+1 Today, Cmd+2 Roadmap, Cmd+L the tutor.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.metaKey || e.shiftKey || e.altKey) {
        return;
      }

      const action = {
        "1": () => show("today"),
        "2": () => show("roadmap"),
        l: () => {
          setView("today");
          requestAnimationFrame(() =>
            window.dispatchEvent(new Event("tp:focus-tutor"))
          );
        },
      }[e.key.toLowerCase()];

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
        <button
          type="button"
          className={`item${view === "today" ? " on" : ""}`}
          title="Today (⌘1)"
          aria-label="Today"
          onClick={() => show("today")}
        >
          <Icon name="today" />
        </button>
        <button
          type="button"
          className={`item${view === "roadmap" ? " on" : ""}`}
          title="Roadmap (⌘2)"
          aria-label="Roadmap"
          onClick={() => show("roadmap")}
        >
          <Icon name="map" />
        </button>
      </nav>

      {/* Today stays mounted so the chat keeps running while the roadmap is open. */}
      <main className={`view today${view === "today" ? " on" : ""}`}>
        <ProblemPanel session={session} />
        <Tutor />
      </main>
      <main className={`view roadmap${view === "roadmap" ? " on" : ""}`}>
        {roadmap && <Roadmap data={roadmap} onContinue={() => show("today")} />}
      </main>
    </div>
  );
};
