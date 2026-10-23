import { Activity, Composer, Message, TutorPane } from "@tech-prep/ui";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

interface Item {
  role: "tutor" | "learner" | "error";
  text: string;
}

const link = {
  a: ({ children, ...props }: React.ComponentProps<"a">) => (
    <a {...props} target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
};

interface TutorProps {
  /** What the learner is looking at, shown in the header. */
  context?: string;
  onClose: () => void;
}

/** Chat with the tutor (Claude Code with the tech-prep plugin, run by the main process). */
export const Tutor = ({ context, onClose }: TutorProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [activity, setActivity] = useState("");
  const [draft, setDraft] = useState("");
  const thread = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const off = window.tp.tutor.onEvent((event) => {
      if (event.type === "message") {
        setItems((all) => [...all, { role: "tutor", text: event.text }]);
        setActivity("");
      } else if (event.type === "activity") {
        setActivity(event.label);
      } else if (event.type === "busy") {
        setBusy(event.busy);

        if (!event.busy) {
          setActivity("");
        }
      } else {
        setItems((all) => [...all, { role: "error", text: event.text }]);
      }
    });

    window.tp.tutor.start();
    const focus = () => input.current?.focus();
    window.addEventListener("tp:focus-tutor", focus);

    return () => {
      off();
      window.removeEventListener("tp:focus-tutor", focus);
    };
  }, []);

  useEffect(() => {
    thread.current?.scrollTo({
      behavior: "smooth",
      top: thread.current.scrollHeight,
    });
    // oxlint-disable-next-line react/exhaustive-effect-dependencies -- items and busy are the triggers, not inputs: scroll to the bottom whenever a message or the activity line appears.
  }, [items, busy]);

  const send = () => {
    const text = draft.trim();

    if (!text) {
      return;
    }

    window.tp.tutor.send(text);
    setItems((all) => [...all, { role: "learner", text }]);
    setDraft("");

    if (input.current) {
      input.current.style.height = "auto";
    }
  };

  return (
    <TutorPane
      composer={
        <Composer
          placeholder="Ask the tutor…"
          textareaRef={input}
          value={draft}
          onChange={setDraft}
          onSend={send}
        />
      }
      context={context}
      threadRef={thread}
      onClose={onClose}
    >
      {items.map((item, i) => (
        <Message from={item.role} key={i}>
          {item.role === "tutor" ? (
            <Markdown components={link}>{item.text}</Markdown>
          ) : (
            item.text
          )}
        </Message>
      ))}
      {busy && <Activity>{activity || "Thinking"}</Activity>}
    </TutorPane>
  );
};
