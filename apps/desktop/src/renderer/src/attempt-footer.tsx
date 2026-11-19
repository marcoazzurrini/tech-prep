import { Button, PaneFooter } from "@tech-prep/ui";
import type { ReactNode } from "react";

interface AttemptFooterProps {
  busy: boolean;
  /** Shown on the left while the learner works. */
  note?: string;
  /** Once finished: the footer's note and its buttons, such as "Next lesson". */
  done?: { note: string; actions: ReactNode };
  onGiveUp: () => void;
  onHint: () => void;
  /** Check the answer without handing it in, for a check that takes a while to pass. */
  onTest?: () => void;
  onSubmit: () => void;
}

/** The buttons under an exercise, or what comes next once it is finished. */
export const AttemptFooter = ({
  busy,
  note,
  done,
  onGiveUp,
  onHint,
  onTest,
  onSubmit,
}: AttemptFooterProps) =>
  done ? (
    <PaneFooter
      start={<span className="tp-pane-footer__note">{done.note}</span>}
    >
      {done.actions}
    </PaneFooter>
  ) : (
    <PaneFooter
      start={
        <>
          <Button disabled={busy} variant="ghost" onClick={onGiveUp}>
            Give up
          </Button>
          {note && <span className="tp-pane-footer__note">{note}</span>}
        </>
      }
    >
      <Button onClick={onHint}>Show hint</Button>
      {onTest && (
        <Button disabled={busy} onClick={onTest}>
          Run tests
        </Button>
      )}
      <Button disabled={busy} variant="primary" onClick={onSubmit}>
        Submit
      </Button>
    </PaneFooter>
  );
