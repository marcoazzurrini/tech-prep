import {
  Button,
  EmptyState,
  LessonPane,
  PaneBody,
  PaneFooter,
} from "@tech-prep/ui";
import { Component, useEffect, useState } from "react";
import type { ReactNode } from "react";

/** Electron wraps an error from the main process in this. The learner needs only what follows. */
const WRAPPER = /^Error invoking remote method '[^']+': (?:Error: )?/u;

const reload = () => window.location.reload();

/** What went wrong, and a way to start again. */
const FailureScreen = ({ reason }: { reason: string }) => (
  <LessonPane>
    <PaneBody>
      <EmptyState title="Something went wrong">
        {reason.replace(WRAPPER, "")} Your progress is saved. Reload to carry
        on.
      </EmptyState>
    </PaneBody>
    <PaneFooter>
      <Button variant="primary" onClick={reload}>
        Reload
      </Button>
    </PaneFooter>
  </LessonPane>
);

interface BoundaryState {
  /** Why drawing failed. Null while all is well. */
  failed: string | null;
}

/** Catches an error thrown while drawing. Only a class component can. */
class Boundary extends Component<{ children: ReactNode }, BoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { failed: null };
  }

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { failed: error.message };
  }

  override render(): ReactNode {
    const { failed } = this.state;

    return failed === null ? (
      this.props.children
    ) : (
      <FailureScreen reason={failed} />
    );
  }
}

/**
 * Shows what went wrong when the app cannot go on. It covers an error while drawing, and a
 * call to the engine that failed with nothing there to handle it. Without it such a failure
 * left a blank or frozen screen.
 */
export const Failure = ({ children }: { children: ReactNode }) => {
  const [rejected, setRejected] = useState<string | null>(null);

  useEffect(() => {
    const onRejection = ({ reason }: PromiseRejectionEvent) => {
      setRejected(reason instanceof Error ? reason.message : String(reason));
    };

    window.addEventListener("unhandledrejection", onRejection);

    return () => window.removeEventListener("unhandledrejection", onRejection);
  }, []);

  return rejected === null ? (
    <Boundary>{children}</Boundary>
  ) : (
    <FailureScreen reason={rejected} />
  );
};
