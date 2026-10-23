import type { ReactNode } from "react";

const TOKEN =
  /(?<comment>\/\/.*$)|(?<string>"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)|\b(?<number>\d+(?:\.\d+)?|true|false|null|undefined|NaN)\b|\b(?<keyword>const|let|var|new|return|if|else|for|of|in|while|function|export|import|from|class|extends|type|interface|async|await|break|continue|throw|try|catch|typeof|instanceof|def|lambda|None|True|False)\b|(?<function>[A-Za-z_$][\w$]*)(?=\()/gu;

/** Colours one line of TypeScript or Python with the syntax tokens. Good enough for short snippets. */
export const highlight = (line: string): ReactNode[] => {
  const out: ReactNode[] = [];
  let last = 0;

  for (const match of line.matchAll(TOKEN)) {
    const kind = Object.entries(match.groups ?? {}).find(
      ([, value]) => value !== undefined
    )?.[0];

    if (match.index > last) {
      out.push(line.slice(last, match.index));
    }

    out.push(
      <span className={`tp-syntax--${kind}`} key={match.index}>
        {match[0]}
      </span>
    );
    last = match.index + match[0].length;
  }

  if (last < line.length) {
    out.push(line.slice(last));
  }

  return out;
};
