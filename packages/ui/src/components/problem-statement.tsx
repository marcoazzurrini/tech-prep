import type { ReactNode } from "react";

import "./problem-statement.css";

/** `code` and **bold**, the only inline marks problem statements use. */
const inline = (text: string): ReactNode[] =>
  text.split(/(?<mark>`[^`]+`|\*\*[^*]+\*\*)/gu).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return <b key={i}>{part.slice(2, -2)}</b>;
    }

    return part;
  });

type Block =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "example"; label: string; lines: string[] }
  | { kind: "extra"; label: string; text: string };

/** The block an "Example 1:" or "Constraints:" style line starts, if it is one. */
const heading = (line: string): Block | null => {
  const example = line.match(
    /^(?<label>Example(?: \d+)?):\s*(?<text>.*)$/u
  )?.groups;

  if (example?.label !== undefined) {
    return {
      kind: "example",
      label: example.label,
      lines: example.text ? [example.text] : [],
    };
  }

  const extra = line.match(
    /^(?<label>Constraints|Follow-up|Note):\s*(?<text>.*)$/u
  )?.groups;

  if (extra?.label !== undefined && extra.text !== undefined) {
    return { kind: "extra", label: extra.label, text: extra.text };
  }

  return null;
};

/**
 * Split a problem.md body (title line already shown) into paragraphs, bullet lists,
 * examples and the trailing notes ("Constraints:", "Follow-up:").
 */
const parse = (statement: string): Block[] => {
  const blocks: Block[] = [];

  const lines = statement
    .split("\n")
    .filter((line, i) => !(i === 0 && line.startsWith("# ")));

  for (const raw of lines) {
    const line = raw.trimEnd();
    const last = blocks.at(-1);

    if (!line.trim()) {
      // An empty paragraph ends the block above it; empty ones are dropped at the end.
      if (!(last?.kind === "p" && !last.text)) {
        blocks.push({ kind: "p", text: "" });
      }

      continue;
    }

    const head = heading(line);

    if (head) {
      blocks.push(head);
    } else if (last?.kind === "example" && /^\s/u.test(raw)) {
      last.lines.push(line.replace(/^ {2}/u, ""));
    } else if (line.startsWith("- ")) {
      if (last?.kind === "list") {
        last.items.push(line.slice(2));
      } else {
        blocks.push({ items: [line.slice(2)], kind: "list" });
      }
    } else if (last?.kind === "p" && last.text) {
      last.text += ` ${line.trim()}`;
    } else if (last?.kind === "extra") {
      last.text += ` ${line.trim()}`;
    } else {
      blocks.push({ kind: "p", text: line.trim() });
    }
  }

  return blocks.filter((b) => b.kind !== "p" || b.text);
};

/** "s = "abc"  ->  3   ("abc")": arrow for ->, and the trailing note in muted text. */
const exampleLine = (line: string, key: number) => {
  const shown = line.replaceAll(/\s*->\s*/gu, "  →  ");
  const parts = shown.match(/^(?<text>.*?)\s{2,}(?<note>\(.*\))$/u)?.groups;

  return (
    <div key={key}>
      {parts?.text !== undefined && parts.note !== undefined ? (
        <>
          {parts.text} <em>{parts.note.slice(1, -1)}</em>
        </>
      ) : (
        shown
      )}
    </div>
  );
};

/** A problem.md body: paragraphs, lists, examples and the closing notes. */
export const ProblemStatement = ({ text }: { text: string }) => {
  const blocks = parse(text);
  const examples = blocks.filter((b) => b.kind === "example");
  const extras = blocks.filter((b) => b.kind === "extra");

  return (
    <div className="tp-statement">
      {blocks.map((b, i) => {
        if (b.kind === "p") {
          return <p key={i}>{inline(b.text)}</p>;
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

        return null;
      })}
      {examples.length > 0 && (
        <div className="tp-statement__examples">
          {examples.map((b, i) => (
            <div className="tp-statement__example" key={i}>
              <div className="tp-statement__label">{b.label}</div>
              {b.lines.map(exampleLine)}
            </div>
          ))}
        </div>
      )}
      {extras.map((b, i) => (
        <p className="tp-statement__note" key={i}>
          <b>{b.label}:</b> {inline(b.text)}
        </p>
      ))}
    </div>
  );
};
