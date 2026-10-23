import { cx } from "../lib/cx";
import { highlight } from "../lib/highlight";

import "./code-block.css";

interface CodeBlockProps {
  code: string;
  /** Show a gutter with line numbers, as in the editor. */
  lineNumbers?: boolean;
  /** 1-based line to mark as the cursor line. */
  currentLine?: number;
  /** Stretch to fill the pane, as the editor does. */
  grow?: boolean;
}

/** Code on the darkest surface, coloured with the syntax tokens. */
export const CodeBlock = ({
  code,
  lineNumbers = false,
  currentLine,
  grow = false,
}: CodeBlockProps) => (
  <pre
    className={cx(
      "tp-code",
      lineNumbers && "tp-code--numbered",
      grow && "tp-code--grow"
    )}
  >
    <code>
      {code.split("\n").map((line, i) => (
        <span
          className={cx(
            "tp-code__line",
            currentLine === i + 1 && "tp-code__line--current"
          )}
          key={i}
        >
          {lineNumbers && <span className="tp-code__number">{i + 1}</span>}
          <span className="tp-code__text">{highlight(line)}</span>
        </span>
      ))}
    </code>
  </pre>
);

interface EditorStatusProps {
  mode: string;
  file: string;
  cursor: string;
}

/** The strip under the editor: Vim mode, file name and cursor position. */
export const EditorStatus = ({ mode, file, cursor }: EditorStatusProps) => (
  <div className="tp-editor-status">
    <b>{mode}</b>
    <span className="tp-editor-status__file">{file}</span>
    <span>{cursor}</span>
  </div>
);
