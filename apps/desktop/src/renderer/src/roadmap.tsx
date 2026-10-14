import { useEffect, useRef, useState } from "react";

import { Icon } from "./icons";
import type { IconName } from "./icons";
import type { Roadmap as RoadmapData } from "./types";

type Topic = RoadmapData["topics"][number];

type Position = [x: number, row: number];

type NodeState = "current" | "progress" | "open" | "locked";

// Graph layout, as in the approved mockup (.impeccable/mocks/src/roadmap.py).
const W = 880;
const NW = 164;
const NH = 58;
const PITCH = 90;
const col5 = (i: number) => (W * (i + 0.5)) / 5;

const POS = new Map<string, Position>([
  ["advanced-graphs", [col5(2), 5]],
  ["arrays-hashing", [W / 2, 0]],
  ["backtracking", [W / 2, 4]],
  ["binary-search", [W * 0.36, 2]],
  ["bit-manipulation", [col5(0), 6]],
  ["dp-1d", [col5(0), 5]],
  ["dp-2d", [col5(1), 6]],
  ["graphs", [col5(1), 5]],
  ["greedy", [col5(4), 5]],
  ["heap", [col5(3) + 40, 4]],
  ["intervals", [col5(3), 5]],
  ["linked-list", [col5(3) - 30, 2]],
  ["math-geometry", [col5(0), 7]],
  ["sliding-window", [col5(0) + 20, 2]],
  ["stack", [W * 0.64, 1]],
  ["trees", [W / 2, 3]],
  ["tries", [col5(1) - 40, 4]],
  ["two-pointers", [W * 0.36, 1]],
]);

const SHORT = new Map([
  ["dp-1d", "1-D DP"],
  ["dp-2d", "2-D DP"],
  ["heap", "Heap"],
  ["math-geometry", "Math & Geometry"],
]);

/**
 * Topics come in roadmap order, so prerequisites are decided first. A topic opens once
 * every prerequisite topic is started and it has something to learn or solve.
 */
const topicStates = (
  topics: Topic[],
  current: string | null
): Map<string, NodeState> => {
  const states = new Map<string, NodeState>();

  for (const t of topics) {
    const started =
      t.solved > 0 ||
      t.concepts.some((c) =>
        ["learning", "passed", "mastered"].includes(c.stage)
      );

    const reachable = t.prereqs.every((p) =>
      ["current", "progress"].includes(states.get(p) ?? "locked")
    );

    const hasWork =
      t.problems.some((p) => p.unlocked) ||
      t.concepts.some((c) => c.stage === "available");

    if (t.id === current) {
      states.set(t.id, "current");
    } else if (started) {
      states.set(t.id, "progress");
    } else if (reachable && hasWork) {
      states.set(t.id, "open");
    } else {
      states.set(t.id, "locked");
    }
  }

  return states;
};

const edgePath = ([xa, ra]: Position, [xb, rb]: Position): string => {
  if (ra === rb) {
    // Same row: a side-to-side connector.
    const y = ra * PITCH + NH / 2;

    const [a, b] =
      xa < xb ? [xa + NW / 2, xb - NW / 2] : [xa - NW / 2, xb + NW / 2];

    return `M${a} ${y} H${b}`;
  }

  const y1 = ra * PITCH + NH;
  const y2 = rb * PITCH;
  const mid = (y1 + y2) / 2;

  return `M${xa} ${y1} C${xa} ${mid} ${xb} ${mid} ${xb} ${y2}`;
};

const days = (iso: string) =>
  Math.round((new Date(iso).getTime() - Date.now()) / 86_400_000);

const ConceptStatus = ({ c }: { c: Topic["concepts"][number] }) => {
  if (c.stage === "passed" || c.stage === "mastered") {
    const d = c.due ? days(c.due) : null;

    if (d !== null && d <= 0) {
      return <span className="tag due">Due today</span>;
    }

    return (
      <>
        <span className="tag pass">
          {c.stage === "mastered" ? "Mastered" : "Passed"}
        </span>
        {d !== null && (
          <span className="when">
            review in {d === 1 ? "1 day" : `${d} days`}
          </span>
        )}
      </>
    );
  }

  if (c.stage === "learning") {
    return <span className="tag next">Learning</span>;
  }

  if (c.stage === "available") {
    return <span className="tag">Ready to learn</span>;
  }

  return <span className="tag">Locked</span>;
};

const problemLabel = (
  p: Topic["problems"][number]
): [label: string, cls: string, icon: IconName | null] => {
  if (p.status === "solved") {
    return ["Solved", "ok", "tick"];
  }

  if (p.status === "solved_with_help") {
    return ["Solved with help", "ok", "tick"];
  }

  if (p.status === "in_progress") {
    return ["In progress", "now", "dot"];
  }

  if (p.status === "attempted") {
    return ["Tried, coming back", "", null];
  }

  if (p.unlocked) {
    return ["Not started", "", null];
  }

  return ["Locked", "", "lock"];
};

const ProblemStatus = ({ p }: { p: Topic["problems"][number] }) => {
  const diff = (
    <span className={`diff ${p.difficulty}`}>
      {p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1)}
    </span>
  );

  const [label, cls, icon] = problemLabel(p);

  return (
    <span className={`s ${cls}`}>
      {diff}
      <span className="st">
        {icon && <Icon name={icon} />}
        {label}
      </span>
    </span>
  );
};

/** Scale the fixed-size graph down to fit the panel, never up. */
const useFit = (width: number, height: number) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;

    if (!el) {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (!el.offsetWidth) {
        return;
      }

      setScale(
        Math.min(
          1,
          (el.offsetWidth - 48) / width,
          (el.offsetHeight - 56) / height
        )
      );
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [width, height]);

  return { ref, scale };
};

export const Roadmap = ({
  data,
  onContinue,
}: {
  data: RoadmapData;
  onContinue: () => void;
}) => {
  const [picked, setPicked] = useState<string | null>(null);
  const { ref, scale } = useFit(W, 7 * PITCH + NH);

  const byId = new Map(data.topics.map((t) => [t.id, t]));
  const states = topicStates(data.topics, data.current);
  const topicId = picked ?? data.current ?? data.topics[0]?.id;
  const topic = topicId === undefined ? undefined : byId.get(topicId);

  if (!topic) {
    return null;
  }

  const solved = data.topics.reduce((n, t) => n + t.solved, 0);
  const total = data.topics.reduce((n, t) => n + t.total, 0);
  const all = data.topics.flatMap((t) => t.concepts);

  const passed = all.filter(
    (c) => c.stage === "passed" || c.stage === "mastered"
  ).length;

  const mastered = all.filter((c) => c.stage === "mastered").length;
  const prereqNames = topic.prereqs.map((id) => byId.get(id)?.name ?? id);
  const unlocked = states.get(topic.id) !== "locked";

  return (
    <>
      <section className="panel">
        <div className="head">
          <div>
            <h1>Roadmap</h1>
            <p className="summary">
              <b>
                {solved} of {total}
              </b>{" "}
              problems solved · <b>{passed}</b> of {all.length} concepts passed
              · <b>{mastered}</b> mastered
            </p>
          </div>
          <div className="legend">
            <span>
              <i className="cur" />
              Now
            </span>
            <span>
              <i className="done" />
              Solved
            </span>
            <span>
              <i />
              Open
            </span>
            <span>
              <i className="lk" />
              Locked
            </span>
          </div>
        </div>
        <div className="stage" ref={ref}>
          <div
            className="graph"
            style={{ transform: `translateX(-50%) scale(${scale})` }}
          >
            <svg
              className="edges"
              width={W}
              height={7 * PITCH + NH}
              aria-hidden="true"
            >
              {data.topics.flatMap((t) =>
                t.prereqs.map((p) => {
                  const from = POS.get(p);
                  const to = POS.get(t.id);

                  return from && to ? (
                    <path
                      key={`${p}-${t.id}`}
                      className={`e${states.get(t.id) === "locked" ? "" : " lit"}`}
                      d={edgePath(from, to)}
                    />
                  ) : null;
                })
              )}
            </svg>
            {data.topics.map((t) => {
              const position = POS.get(t.id);
              const state = states.get(t.id);

              if (!position || !state) {
                return null;
              }

              const [x, row] = position;

              return (
                <button
                  type="button"
                  key={t.id}
                  className={`node ${state}${t.id === topic.id ? " picked" : ""}`}
                  style={{ left: x - NW / 2, top: row * PITCH }}
                  onClick={() => setPicked(t.id)}
                  aria-pressed={t.id === topic.id}
                >
                  <b>{SHORT.get(t.id) ?? t.name}</b>
                  <span className="meta">
                    {state === "locked" ? (
                      <>
                        <Icon name="lock" className="lk" />
                        <span className="cnt">
                          {t.total} problem{t.total === 1 ? "" : "s"}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="bar">
                          <i
                            style={{
                              width: `${(100 * t.solved) / Math.max(1, t.total)}%`,
                            }}
                          />
                        </span>
                        <span className="cnt">
                          {t.solved} / {t.total}
                        </span>
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="ph">Topic</div>
        <div className="detail scroll">
          <h2>{topic.name}</h2>
          <p className={`needs${unlocked ? " ok" : ""}`}>
            <Icon name={unlocked ? "tick" : "lock"} />
            {prereqNames.length
              ? `${unlocked ? "Unlocked" : "Unlocks after"} ${prereqNames.join(" and ")}`
              : "Where the path starts"}{" "}
            · {topic.solved} of {topic.total} solved
          </p>

          <h3>Concepts</h3>
          {topic.concepts.map((c) => (
            <div className="row" key={c.id}>
              <span className="t">{c.name}</span>
              <span className="s">
                <ConceptStatus c={c} />
              </span>
              <span className="k">{c.key_idea}</span>
            </div>
          ))}

          <h3>Problems</h3>
          {topic.problems.map((p) => (
            <div className="row prob" key={p.slug}>
              <span className="t">{p.title}</span>
              <ProblemStatus p={p} />
            </div>
          ))}
        </div>
        <div className="foot-btn">
          <button type="button" className="btn" onClick={onContinue}>
            <Icon name="play" />
            Continue today&apos;s session
          </button>
        </div>
      </section>
    </>
  );
};
