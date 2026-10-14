import type { ReactNode } from "react";

/** `code` and **bold**, the only inline marks problem statements use. */
export function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <b key={i}>{part.slice(2, -2)}</b>;
    }
    return part;
  });
}

type Block =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "example"; label: string; lines: string[] }
  | { kind: "extra"; label: string; text: string };

/**
 * Split a problem.md body (title line already shown) into paragraphs, bullet lists,
 * examples and the trailing notes ("Constraints:", "Follow-up:").
 */
function parse(statement: string): Block[] {
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

    const example = line.match(/^(Example(?: \d+)?):\s*(.*)$/);
    const extra = line.match(/^(Constraints|Follow-up|Note):\s*(.*)$/);

    if (example) {
      blocks.push({
        kind: "example",
        label: example[1]!,
        lines: example[2] ? [example[2]] : [],
      });
    } else if (extra) {
      blocks.push({ kind: "extra", label: extra[1]!, text: extra[2]! });
    } else if (last?.kind === "example" && /^\s/.test(raw)) {
      last.lines.push(line.replace(/^ {2}/, ""));
    } else if (line.startsWith("- ")) {
      if (last?.kind === "list") {
        last.items.push(line.slice(2));
      } else {
        blocks.push({ kind: "list", items: [line.slice(2)] });
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
}

/** "s = "abc"  ->  3   ("abc")": arrow for ->, and the trailing note in muted text. */
function exampleLine(line: string, key: number) {
  const shown = line.replaceAll(/\s*->\s*/g, "  →  ");
  const note = shown.match(/^(.*?)\s{2,}(\(.*\))$/);

  return (
    <div key={key}>
      {note ? (
        <>
          {note[1]} <em>{note[2]!.slice(1, -1)}</em>
        </>
      ) : (
        shown
      )}
    </div>
  );
}

export function Statement({ text }: { text: string }) {
  const blocks = parse(text);
  const examples = blocks.filter((b) => b.kind === "example");
  const extras = blocks.filter((b) => b.kind === "extra");

  return (
    <div className="statement">
      {blocks.map((b, i) =>
        b.kind === "p" ? (
          <p key={i}>{inline(b.text)}</p>
        ) : b.kind === "list" ? (
          <ul key={i}>
            {b.items.map((item, j) => (
              <li key={j}>{inline(item)}</li>
            ))}
          </ul>
        ) : null
      )}
      {examples.length > 0 && (
        <div className="exs">
          {examples.map((b, i) => (
            <div className="ex" key={i}>
              <div className="label">{b.label}</div>
              {b.lines.map(exampleLine)}
            </div>
          ))}
        </div>
      )}
      {extras.map((b, i) => (
        <p className="extra" key={i}>
          <b>{b.label}:</b> {inline(b.text)}
        </p>
      ))}
    </div>
  );
}
