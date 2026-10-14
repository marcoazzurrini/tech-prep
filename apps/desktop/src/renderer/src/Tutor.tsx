import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Markdown from "react-markdown";

import { Icon } from "./icons";
import type { TutorEvent } from "./types";

interface Item {
  role: "tutor" | "you" | "error";
  text: string;
}

const link = {
  a: (props: React.ComponentProps<"a">) => (
    <a {...props} target="_blank" rel="noreferrer" />
  ),
};

/** Chat with the tutor (Claude Code with the tech-prep plugin, run by the main process). */
export function Tutor() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [activity, setActivity] = useState("");
  const [draft, setDraft] = useState("");
  const chat = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const off = window.tp.tutor.onEvent((payload) => {
      const event = payload as TutorEvent;

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
    chat.current?.scrollTo({
      behavior: "smooth",
      top: chat.current.scrollHeight,
    });
  }, [items, busy]);

  const send = () => {
    const text = draft.trim();

    if (!text) {
      return;
    }
    window.tp.tutor.send(text);
    setItems((all) => [...all, { role: "you", text }]);
    setDraft("");

    if (input.current) {
      input.current.style.height = "auto";
    }
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  return (
    <section className="panel">
      <div className="ph">
        <Icon name="chat" />
        Tutor
      </div>
      <div className="chat scroll" ref={chat} aria-live="polite">
        {items.map((item, i) =>
          item.role === "error" ? (
            <div className="msg err" key={i}>
              {item.text}
            </div>
          ) : (
            <div className={`msg${item.role === "you" ? " me" : ""}`} key={i}>
              <span className="who">
                {item.role === "you" ? "You" : "Tutor"}
              </span>
              {item.role === "you" ? (
                <p>{item.text}</p>
              ) : (
                <Markdown components={link}>{item.text}</Markdown>
              )}
            </div>
          )
        )}
        {busy && (
          <div className="activity">
            <i />
            {activity || "Thinking"}
          </div>
        )}
      </div>
      <div className="input">
        <textarea
          ref={input}
          rows={1}
          value={draft}
          placeholder="Ask the tutor…"
          aria-label="Message the tutor"
          onChange={(e) => {
            setDraft(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onKeyDown={onKey}
        />
        <button
          className="send"
          title="Send"
          aria-label="Send"
          disabled={!draft.trim()}
          onClick={send}
        >
          <Icon name="up" />
        </button>
      </div>
    </section>
  );
}
