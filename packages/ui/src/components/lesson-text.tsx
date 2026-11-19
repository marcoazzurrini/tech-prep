import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { CodeBlock } from "./code-block";
import { inline } from "./problem-statement";

import "./lesson-text.css";

type Block =
  | { kind: "h"; text: string }
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "code"; lines: string[] };

/**
 * Split a lesson.md body into headings, paragraphs, bullet lists and code blocks. The title
 * line is dropped: the page shows the lesson's name itself.
 */
const parse = (text: string): Block[] => {
  const blocks: Block[] = [];
  let code: string[] | null = null;

  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    const last = blocks.at(-1);

    if (line.startsWith("```")) {
      if (code) {
        blocks.push({ kind: "code", lines: code });
        code = null;
      } else {
        code = [];
      }
    } else if (code) {
      code.push(raw);
    } else if (line.startsWith("# ")) {
      // The title: shown by the page.
    } else if (line.startsWith("## ")) {
      blocks.push({ kind: "h", text: line.slice(3) });
    } else if (line.startsWith("- ")) {
      if (last?.kind === "list") {
        last.items.push(line.slice(2));
      } else {
        blocks.push({ items: [line.slice(2)], kind: "list" });
      }
    } else if (!line.trim()) {
      // A blank line ends the paragraph above it.
      blocks.push({ kind: "p", text: "" });
    } else if (last?.kind === "p" && last.text) {
      last.text += ` ${line.trim()}`;
    } else if (last?.kind === "list" && /^\s/u.test(raw)) {
      last.items[last.items.length - 1] += ` ${line.trim()}`;
    } else {
      blocks.push({ kind: "p", text: line.trim() });
    }
  }

  return blocks.filter((b) => b.kind !== "p" || b.text);
};

/** One stretch of lesson text, as headings, paragraphs, lists and code. */
const Blocks = ({ text }: { text: string }) => (
  <>
    {parse(text).map((b, i) => {
      if (b.kind === "h") {
        return <h2 key={i}>{b.text}</h2>;
      }

      if (b.kind === "code") {
        return <CodeBlock code={b.lines.join("\n")} key={i} />;
      }

      if (b.kind === "list") {
        return (
          <ul key={i}>
            {b.items.map((item, j) => (
              <li key={j}>{inline(item)}</li>
            ))}
          </ul>
        );
      }

      return <p key={i}>{inline(b.text)}</p>;
    })}
  </>
);

/** One part of a lesson. The part the learner has just reached scrolls into view. */
const Part = ({
  current,
  children,
}: {
  current: boolean;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (current) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [current]);

  return (
    <section className="tp-lesson-text__part" ref={ref}>
      {children}
    </section>
  );
};

interface LessonTextProps {
  /** The lesson's name, shown as the heading. */
  title: string;
  /**
   * The lesson.md body. A list shows a lesson in parts: the last one is the part the learner
   * is on, and the page scrolls to it when it appears.
   */
  text: string | string[];
  /** A chip above the title, such as "Lesson". */
  label?: ReactNode;
  /** What follows the lesson in the same column, such as the task to do. */
  children?: ReactNode;
}

/** A written lesson: the idea, a worked example, why it works and when to use it. */
export const LessonText = ({
  title,
  text,
  label,
  children,
}: LessonTextProps) => (
  <article className="tp-lesson-text">
    {label && <div className="tp-lesson-text__label">{label}</div>}
    <h1>{title}</h1>
    {[text].flat().map((part, i, all) => (
      <Part current={all.length > 1 && i === all.length - 1} key={i}>
        <Blocks text={part} />
      </Part>
    ))}
    {children}
  </article>
);

interface YourTurnProps {
  /** Such as "Your turn · with the lesson". */
  label: string;
  title: string;
  children: ReactNode;
}

/** The task that follows a lesson, set apart so the learner sees where reading ends and doing starts. */
export const YourTurn = ({ label, title, children }: YourTurnProps) => (
  <section className="tp-your-turn">
    <p className="tp-your-turn__label">{label}</p>
    <h2>{title}</h2>
    {children}
  </section>
);

interface TaskTextProps {
  /** Chips above the title, such as "Review 1 of 2" and the difficulty. */
  chips?: ReactNode;
  title: string;
  /** The statement, and the verdict once the problem is finished. */
  children: ReactNode;
}

/** A problem to read beside the editor: chips, a large title, then the statement. */
export const TaskText = ({ chips, title, children }: TaskTextProps) => (
  <article className="tp-task-text">
    {chips && <div className="tp-task-text__chips">{chips}</div>}
    <h1>{title}</h1>
    {children}
  </article>
);
