import { Icon } from "./icons";
import { Statement } from "./Statement";
import type { Session } from "./types";

const DIFFICULTY = { easy: "Easy", medium: "Medium", hard: "Hard" };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
}

export function ProblemPanel({ session }: { session: Session | null }) {
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
  const inLesson = !review && problem.new_concepts.length > 0;
  const phase = review ? "Review" : inLesson ? "Learn" : "Practise";

  return (
    <section className="panel scroll">
      <div className="session">
        <div className="track one">
          <i className="on" />
        </div>
        <div className="srow">
          <span>
            <b>{phase}</b>
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
