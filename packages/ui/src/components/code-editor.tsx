import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import {
  HighlightStyle,
  bracketMatching,
  indentOnInput,
  indentUnit,
  syntaxHighlighting,
} from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import type { Extension } from "@codemirror/state";
import {
  EditorView,
  drawSelection,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { Vim, getCM, vim } from "@replit/codemirror-vim";
import { useEffect, useRef, useState } from "react";

import { cx } from "../lib/cx";
import { EditorStatus } from "./code-block";

import "./code-editor.css";

const theme = EditorView.theme(
  {
    "&": {
      backgroundColor: "var(--color-canvas)",
      color: "var(--color-body)",
      height: "100%",
    },
    "&.cm-focused": { outline: "none" },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
      backgroundColor: "var(--color-accent-line)",
    },
    ".cm-activeLine": { backgroundColor: "var(--color-hover)" },
    ".cm-activeLineGutter": {
      backgroundColor: "var(--color-hover)",
      color: "var(--color-body)",
    },
    ".cm-content": { caretColor: "var(--color-ink)", padding: "16px 0" },
    ".cm-cursor": { borderLeftColor: "var(--color-ink)" },
    ".cm-fat-cursor": {
      background: "var(--color-ink) !important",
      color: "var(--color-canvas) !important",
    },
    ".cm-gutters": {
      backgroundColor: "var(--color-canvas)",
      border: "none",
      color: "var(--color-dim)",
    },
    ".cm-line": { padding: "0 16px 0 8px" },
    ".cm-lineNumbers .cm-gutterElement": {
      minWidth: "52px",
      padding: "0 16px 0 0",
    },
    ".cm-matchingBracket": {
      backgroundColor: "var(--color-raised)",
      outline: "none",
    },
    ".cm-panels": {
      backgroundColor: "var(--color-canvas)",
      color: "var(--color-body)",
    },
    ".cm-scroller": {
      fontFamily: "var(--font-mono)",
      fontSize: "14px",
      lineHeight: "24px",
    },
  },
  { dark: true }
);

const syntax = HighlightStyle.define([
  {
    color: "var(--color-syntax-keyword)",
    tag: [tags.keyword, tags.modifier, tags.operatorKeyword, tags.self],
  },
  { color: "var(--color-syntax-string)", tag: [tags.string, tags.regexp] },
  {
    color: "var(--color-syntax-number)",
    tag: [tags.number, tags.bool, tags.null, tags.atom],
  },
  { color: "var(--color-syntax-comment)", tag: tags.comment },
  {
    color: "var(--color-syntax-function)",
    tag: [
      tags.function(tags.variableName),
      tags.function(tags.propertyName),
      tags.definition(tags.function(tags.variableName)),
    ],
  },
]);

const MODES = new Map([
  ["insert", "INSERT"],
  ["normal", "NORMAL"],
  ["replace", "REPLACE"],
  ["visual", "VISUAL"],
]);

/** The languages the editor colours. */
const GRAMMARS = new Map<string, () => Extension>([
  ["python", python],
  ["typescript", () => javascript({ typescript: true })],
]);

interface CodeEditorProps {
  /** The text the editor opens with. Change `key` to load other text. */
  initialValue: string;
  /** What the text is written in. A language the editor has no grammar for gets no colours. */
  language: string;
  /** Shown in the status strip, such as "two-sum.ts". */
  file: string;
  readOnly?: boolean;
  /** A few lines tall, for a short answer such as a jq filter. It opens ready to type. */
  compact?: boolean;
  onChange?: (value: string) => void;
}

/** The light in-app editor: Vim keys, line numbers and the syntax tokens. */
export const CodeEditor = ({
  initialValue,
  language,
  file,
  readOnly = false,
  compact = false,
  onChange,
}: CodeEditorProps) => {
  const host = useRef<HTMLDivElement>(null);
  const changed = useRef(onChange);
  // The editor owns its text after it opens; the parent remounts it with `key` to load other text.
  const initial = useRef(initialValue);
  const [mode, setMode] = useState("NORMAL");
  const [cursor, setCursor] = useState("1:1");

  useEffect(() => {
    changed.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!host.current) {
      return;
    }

    const view = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: initial.current,
        extensions: [
          vim(),
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          drawSelection(),
          history(),
          bracketMatching(),
          closeBrackets(),
          indentOnInput(),
          indentUnit.of(language === "python" ? "    " : "  "),
          EditorState.tabSize.of(language === "python" ? 4 : 2),
          EditorState.readOnly.of(readOnly),
          keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            indentWithTab,
          ]),
          GRAMMARS.get(language)?.() ?? [],
          syntaxHighlighting(syntax),
          theme,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              changed.current?.(update.state.doc.toString());
            }

            if (update.selectionSet || update.docChanged) {
              const { head } = update.state.selection.main;
              const line = update.state.doc.lineAt(head);
              setCursor(`${line.number}:${head - line.from + 1}`);
            }
          }),
        ],
      }),
    });

    const cm = getCM(view);

    cm?.on("vim-mode-change", (event: { mode: string }) => {
      setMode(MODES.get(event.mode) ?? event.mode.toUpperCase());
    });

    // A short answer is typed at once, so the editor takes the cursor, at the end, in insert mode.
    if (compact && !readOnly && cm) {
      view.focus();
      Vim.handleKey(cm, "A", "mapping");
    }

    return () => view.destroy();
  }, [language, readOnly, compact]);

  return (
    <div className={cx("tp-editor", compact && "tp-editor--compact")}>
      <div className="tp-editor__view" ref={host} />
      <EditorStatus cursor={cursor} file={file} mode={mode} />
    </div>
  );
};
