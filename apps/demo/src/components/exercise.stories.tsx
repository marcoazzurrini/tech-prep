import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnswerInput, LineSlot, PaneSection, TestRow } from "@tech-prep/ui";

const Exercise = () => (
  <div style={{ background: "var(--color-panel)", width: 640 }}>
    <PaneSection label="Your answer">
      <AnswerInput aria-label="Your answer" defaultValue="4" />
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

const meta = {
  component: Exercise,
  title: "Components/Exercise parts",
} satisfies Meta<typeof Exercise>;

export default meta;

export const All: StoryObj<typeof meta> = {};
