import { ArrowRight, Check, X } from "lucide-react";
import type { ReactNode } from "react";

import { cx } from "../lib/cx";
import { highlight } from "../lib/highlight";
import { CodeBlock } from "./code-block";
import { inline } from "./problem-statement";

import "./lesson-text.css";

/** What a lesson.md body is made of, line by line. */
type Raw =
  | { kind: "h"; text: string }
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "code"; lang: string; lines: string[] };

/** A block of code under a small label, such as "Input" or "Wrong". */
interface Labelled {
  kind: "labelled";
  label: string;
  lines: string[];
}

/**
 * A filter built up one step at a time, with the value each step gives. A step that gives
 * several outputs separates them with " ;; ".
 */
interface Steps {
  kind: "steps";
  rows: { filter: string; value: string }[];
}

type Block =
  | Raw
  | { kind: "example"; parts: (Labelled | Steps)[] }
  | { kind: "rule"; text: string }
  | { kind: "mistake"; text: string; parts: (Labelled | Steps)[] };

/**
 * Split a lesson.md body into headings, paragraphs, bullet lists and code blocks. The title
 * line is dropped: the page shows the lesson's name itself.
 */
const lines = (text: string): Raw[] => {
  const blocks: Raw[] = [];
  let code: { lang: string; lines: string[] } | null = null;

  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    const last = blocks.at(-1);

    if (line.startsWith("```")) {
      if (code) {
        blocks.push({ kind: "code", ...code });
        code = null;
      } else {
        code = { lang: line.slice(3).trim(), lines: [] };
      }
    } else if (code) {
      code.lines.push(raw);
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

const LABEL = /^\*\*(?<label>[^*:]+)\*\*$/u;
const RULE = /^\*\*Rule:\*\*\s*(?<text>.+)$/u;
const MISTAKE = /^\*\*Common mistake:\*\*\s*(?<text>.+)$/u;

/** "filter => value" lines, as written in a ```steps block. */
const stepsOf = (rows: string[]): Steps => ({
  kind: "steps",
  rows: rows.flatMap((row) => {
    const at = row.indexOf(" => ");

    if (!row.trim()) {
      return [];
    }

    return at === -1
      ? [{ filter: row.trim(), value: "" }]
      : [{ filter: row.slice(0, at).trim(), value: row.slice(at + 4).trim() }];
  }),
});

const labelOf = (text: string): string | undefined =>
  LABEL.exec(text)?.groups?.label;

/** A paragraph that opens a rule or a common mistake, as that block. Else the block as it is. */
const named = (block: Raw): Block => {
  const rule = block.kind === "p" && RULE.exec(block.text)?.groups?.text;
  const mistake = block.kind === "p" && MISTAKE.exec(block.text)?.groups?.text;

  if (rule) {
    return { kind: "rule", text: rule };
  }

  return mistake ? { kind: "mistake", parts: [], text: mistake } : block;
};

/**
 * Group the lines into the fixed blocks of a lesson:
 * - an example: code under labels such as **Input**, and a ```steps block;
 * - a rule: a paragraph that starts with **Rule:**;
 * - a common mistake: a paragraph that starts with **Common mistake:**, then the code
 *   under **Wrong**, **Error** and **Fix**.
 */
const parse = (text: string): Block[] => {
  const raw = lines(text);
  const blocks: Block[] = [];

  /** Add a part to the block above it, or start an example with it. */
  const add = (part: Labelled | Steps) => {
    const last = blocks.at(-1);

    if (last?.kind === "example" || last?.kind === "mistake") {
      last.parts.push(part);
    } else {
      blocks.push({ kind: "example", parts: [part] });
    }
  };

  for (let i = 0; i < raw.length; i += 1) {
    const block = raw[i];
    const next = raw[i + 1];
    const label = block?.kind === "p" ? labelOf(block.text) : undefined;

    if (label !== undefined && next?.kind === "code") {
      add({ kind: "labelled", label, lines: next.lines });
      i += 1;
    } else if (block?.kind === "code" && block.lang === "steps") {
      add(stepsOf(block.lines));
    } else if (block) {
      blocks.push(named(block));
    }
  }

  return blocks;
};

/** How a labelled block of code is toned: by what its label says. */
const toneOf = (label: string) => {
  if (label === "Wrong") {
    return "wrong";
  }

  if (label === "Error") {
    return "error";
  }

  return label === "Fix" ? "fix" : undefined;
};

/** A line of code. The part between « and » is tinted: the one thing to look at. */
const marked = (line: string, plain: boolean): ReactNode[] =>
  line.split(/«(?<mark>[^»]*)»/u).map((part, i) =>
    i % 2 === 1 ? (
      <mark className="tp-lesson-mark" key={i}>
        {part}
      </mark>
    ) : (
      <span key={i}>{plain ? part : highlight(part)}</span>
    )
  );

/** Code under a small label. A wrong command and its error are red, the fix is green. */
const LabelledCode = ({ label, lines: code }: Labelled) => {
  const tone = toneOf(label);

  return (
    <>
      <p className={cx("tp-lesson-label", tone && `tp-lesson-label--${tone}`)}>
        {tone === "wrong" && <X size={14} aria-hidden />}
        {tone === "fix" && <Check size={14} aria-hidden />}
        {label}
      </p>
      <pre className={cx("tp-code", tone && `tp-lesson-code--${tone}`)}>
        <code>
          {code.map((line, i) => (
            <span className="tp-code__line" key={i}>
              <span className="tp-code__text">
                {marked(line, tone === "error")}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </>
  );
};

/** A filter one step at a time: each row is the filter so far and the value it gives. */
const StepRows = ({ rows }: Steps) => (
  <>
    <p className="tp-lesson-label">Step by step</p>
    <div className="tp-lesson-steps">
      {rows.map((row, i) => (
        <div className="tp-lesson-steps__row" key={i}>
          <code>{marked(row.filter, true)}</code>
          <ArrowRight size={14} aria-label="gives" />
          <code>
            {/* Several outputs show one per line, as jq prints them. */}
            {row.value.split(" ;; ").map((value, j) => (
              <span key={j}>{highlight(value)}</span>
            ))}
          </code>
        </div>
      ))}
    </div>
  </>
);

const Parts = ({ parts }: { parts: (Labelled | Steps)[] }) => (
  <>
    {parts.map((part, i) =>
      part.kind === "steps" ? (
        <StepRows {...part} key={i} />
      ) : (
        <LabelledCode {...part} key={i} />
      )
    )}
  </>
);

/** One stretch of lesson text: headings, paragraphs, lists, code and the fixed blocks. */
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

      if (b.kind === "example") {
        return (
          <section className="tp-lesson-example" key={i}>
            <p className="tp-lesson-block-label">Example</p>
            <Parts parts={b.parts} />
          </section>
        );
      }

      if (b.kind === "rule") {
        return (
          <section className="tp-lesson-rule" key={i}>
            <p className="tp-lesson-block-label">Rule</p>
            <p>{inline(b.text)}</p>
          </section>
        );
      }

      if (b.kind === "mistake") {
        return (
          <section className="tp-lesson-mistake" key={i}>
            <p className="tp-lesson-block-label tp-lesson-block-label--red">
              Common mistake
            </p>
            <p>{inline(b.text)}</p>
            <Parts parts={b.parts} />
          </section>
        );
      }

      return <p key={i}>{inline(b.text)}</p>;
    })}
  </>
);

interface LessonTextProps {
  /** The lesson's name, shown as the heading. */
  title: string;
  /** The lesson.md body, or one part of it. */
  text: string;
  /** What follows the lesson in the same column, such as the task to do. */
  children?: ReactNode;
}

/**
 * A written lesson. Each part leads with an example, names the rule it shows, and ends
 * with the common mistake.
 */
export const LessonText = ({ title, text, children }: LessonTextProps) => (
  <article className="tp-lesson-text">
    <h1>{title}</h1>
    <Blocks text={text} />
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
  /** The problem's name. A short task is headed by the first line of its statement. */
  title: ReactNode;
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
