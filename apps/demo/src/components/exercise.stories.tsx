import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AnswerInput,
  AnswerText,
  Confidence,
  LineSlot,
  PaneSection,
  ResultCard,
  TestRow,
} from "@tech-prep/ui";
import type { ConfidenceLevel } from "@tech-prep/ui";
import { useState } from "react";

const Exercise = () => {
  const [sure, setSure] = useState<ConfidenceLevel | null>("medium");

  return (
    <div style={{ background: "var(--color-panel)", width: 640 }}>
      <PaneSection label="Your answer">
        <AnswerInput aria-label="Your answer" defaultValue="4" tone="red" />
      </PaneSection>
      <PaneSection label="How sure are you?">
        <Confidence value={sure} onChange={setSure} />
      </PaneSection>
      <PaneSection>
        <ResultCard
          note="Uniqueness rule: not there yet."
          title="It prints 5"
          tone="red"
        />
      </PaneSection>
      <PaneSection label="Your answer, in your own words">
        <AnswerText aria-label="Your answer" placeholder="In your own words…" />
      </PaneSection>
      <PaneSection label="Arrange the lines">
        <LineSlot code="const seen = new Set();" index={1} />
        <LineSlot code="for (const t of tags) seen.add(t);" index={2} />
        <LineSlot code="seen.sort();" spare />
      </PaneSection>
      <PaneSection label="Tests">
        <TestRow name="keeps the first item for each key" status="pass" />
        <TestRow
          detail="expected 2 items, got 3"
          name="drops later duplicates"
          status="fail"
        />
        <TestRow name="returns [] for an empty list" status="pending" />
      </PaneSection>
    </div>
  );
};

const meta = {
  component: Exercise,
  title: "Components/Exercise parts",
} satisfies Meta<typeof Exercise>;

export default meta;

export const All: StoryObj<typeof meta> = {};
