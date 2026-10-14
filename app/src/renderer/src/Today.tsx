import { Icon } from "./icons";
import { Statement } from "./Statement";
import type { Session, TestEvent } from "./types";

const DIFFICULTY = { easy: "Easy", medium: "Medium", hard: "Hard" };

/** Where the learner is in a lesson, read from the file open in Neovim. */
function lessonStep(file: string): 1 | 2 | 3 {
  if (/-example(-\d+)?\.\w+$/.test(file)) return 1;
  if (/-exercise(-\d+)?\.\w+$/.test(file)) return 2;
  return 3;
}

const STEP_NAMES = { 1: "Example", 2: "Exercise", 3: "Problem" };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
}

export function ProblemPanel({ session, file }: { session: Session | null; file: string }) {
  if (!session) return <section className="panel" />;
  const { problem, attempt, next } = session;

  if (!problem) {
    return (
      <section className="panel">
        <div className="empty">
          <h1>Nothing to do right now</h1>
          <p style={{ marginTop: 16 }}>
            {next.action === "done_for_now" && next.next_due
              ? `Your next review is on ${formatDate(next.next_due)}.`
              : next.why}
          </p>
        </div>
      </section>
    );
  }

  const review = attempt ? attempt.phase === "review" : next.action === "review";
  const inLesson = !review && (problem.new_concepts.length > 0 || lessonStep(file) < 3);
  const step = lessonStep(file);
  const phase = review ? "Review" : inLesson ? "Learn" : "Practise";

  return (
    <section className="panel scroll">
      <div className="session">
        {inLesson ? (
          <div className="track">
            {[1, 2, 3].map((n) => (
              <i key={n} className={n <= step ? "on" : ""} />
            ))}
          </div>
        ) : (
          <div className="track one">
            <i className="on" />
          </div>
        )}
        <div className="srow">
          <span>
            <b>{phase}</b>
            {inLesson && ` · ${STEP_NAMES[step]}`}
          </span>
          {inLesson && problem.new_concepts.length > 0 && <span>New: {problem.new_concepts.join(", ")}</span>}
        </div>
      </div>
      <div className="desc">
        <h1>{problem.title}</h1>
        <div className="pills">
          <span className={`pill ${problem.difficulty}`}>{DIFFICULTY[problem.difficulty]}</span>
          <span className="pill">{phase}</span>
        </div>
        {review && (
          <div className="note">
            <Icon name="lock" />
            {problem.concept_count} concept{problem.concept_count === 1 ? "" : "s"} · revealed when you finish
          </div>
        )}
        {problem.statement ? (
          <Statement text={problem.statement} />
        ) : (
          <p className="empty" style={{ padding: "24px 0 0" }}>
            This problem has no statement yet.
          </p>
        )}
      </div>
    </section>
  );
}

const show = (value: unknown) => (value === undefined ? "nothing" : JSON.stringify(value));

export function TestPanel({ test }: { test: TestEvent | null }) {
  if (!test) {
    return (
      <section className="panel">
        <div className="tests">
          <p className="idle">
            Press <code>&lt;leader&gt;tt</code> in Neovim to run the tests.
          </p>
        </div>
      </section>
    );
  }
  if (test.type === "test_start") {
    return (
      <section className="panel">
        <div className="tests">
          <div className="activity">
            <i />
            Running the tests
          </div>
        </div>
      </section>
    );
  }

  const { passed, total, fatal, failure } = test;
  const allPass = !fatal && passed === total;
  return (
    <section className="panel">
      <div className="tests">
        <div className="sum">
          <strong className={allPass ? "ok" : fatal ? "bad" : ""}>{fatal ? "Did not run" : `${passed} / ${total} passed`}</strong>
          {!fatal && total <= 40 && (
            <span className="dots" aria-hidden="true">
              {Array.from({ length: total }, (_, i) => (
                <b key={i} className={i < passed ? "" : "x"} />
              ))}
            </span>
          )}
          <span className="aside">{test.file.split("/").pop()}</span>
        </div>
        {fatal && <pre className="error">{fatal}</pre>}
        {failure && failure.expected !== null && failure.args.length > 0 ? (
          <div className="fail">
            <div>
              <label>Input</label>
              <div className="v">{failure.args.map(show).join(", ")}</div>
            </div>
            <div>
              <label>Expected</label>
              <div className="v">{show(failure.expected)}</div>
            </div>
            <div>
              <label>Got</label>
              <div className="v bad">{failure.error ?? show(failure.actual)}</div>
            </div>
          </div>
        ) : (
          failure?.error && <pre className="error">{failure.error}</pre>
        )}
      </div>
    </section>
  );
}
