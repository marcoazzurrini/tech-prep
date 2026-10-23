import { ArrowUp, X } from "lucide-react";
import type { KeyboardEvent, ReactNode, Ref } from "react";

import { cx } from "../lib/cx";
import { IconButton } from "./button";

import "./tutor.css";

interface TutorPaneProps {
  /** What the tutor is looking at, such as the lesson title. */
  context?: ReactNode;
  onClose?: () => void;
  /** The thread: messages, then the activity line. */
  children: ReactNode;
  composer: ReactNode;
  threadRef?: Ref<HTMLDivElement>;
}

/** The tutor chat beside the lesson. */
export const TutorPane = ({
  context,
  onClose,
  children,
  composer,
  threadRef,
}: TutorPaneProps) => (
  <aside aria-label="Tutor" className="tp-tutor">
    <header className="tp-tutor__header">
      <h2>Tutor</h2>
      {context && <span className="tp-tutor__context">{context}</span>}
      <span className="tp-tutor__spacer" />
      {onClose && (
        <IconButton
          icon={X}
          label="Close the tutor"
          variant="ghost"
          onClick={onClose}
        />
      )}
    </header>
    <div aria-live="polite" className="tp-tutor__thread" ref={threadRef}>
      <div className="tp-tutor__messages">{children}</div>
    </div>
    <div className="tp-tutor__composer">{composer}</div>
  </aside>
);

interface MessageProps {
  from: "tutor" | "learner" | "error";
  children: ReactNode;
}

/** The learner speaks in a bubble; the tutor replies in plain text so long answers stay easy to read. */
export const Message = ({ from, children }: MessageProps) => (
  <div className={cx("tp-message", `tp-message--${from}`)}>{children}</div>
);

/** Shown while the tutor works, such as "Running the tests". */
export const Activity = ({ children }: { children: ReactNode }) => (
  <div className="tp-activity">
    <i aria-hidden />
    {children}
  </div>
);

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  textareaRef?: Ref<HTMLTextAreaElement>;
}

export const Composer = ({
  value,
  onChange,
  onSend,
  placeholder = "Ask about this lesson…",
  textareaRef,
}: ComposerProps) => {
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="tp-composer">
      <textarea
        aria-label="Message the tutor"
        placeholder={placeholder}
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        onKeyDown={onKey}
      />
      <button
        aria-label="Send"
        className="tp-composer__send"
        disabled={!value.trim()}
        title="Send"
        type="button"
        onClick={onSend}
      >
        <ArrowUp size={14} aria-hidden />
      </button>
    </div>
  );
};
