import type { Meta, StoryObj } from "@storybook/react-vite";
import { TopBar } from "@tech-prep/ui";
import { fn } from "storybook/test";

const meta = {
  args: {
    chapter: "Sets",
    lesson: "Uniqueness rule",
    onNext: fn(),
    onPrevious: fn(),
    onToggleTutor: fn(),
    position: "Lesson 2 of 5",
    tutorOpen: false,
  },
  component: TopBar,
  decorators: [
    (Story) => (
      <div style={{ background: "var(--color-panel)", width: 900 }}>
        <Story />
      </div>
    ),
  ],
  title: "Components/Top bar",
} satisfies Meta<typeof TopBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TutorClosed: Story = {};

export const TutorOpen: Story = { args: { tutorOpen: true } };

/** A lesson has two steps; the dots show which one the learner is on. */
export const WithSteps: Story = {
  args: {
    onNext: undefined,
    onPrevious: undefined,
    position: "Step 2 of 2 · On your own",
    steps: { at: 1, count: 2 },
  },
};

/** A lesson in parts lists them in place of the chapter and the lesson, which the sidebar names. */
export const WithTrail: Story = {
  args: {
    chapter: undefined,
    lesson: undefined,
    onNext: undefined,
    onPrevious: undefined,
    position: undefined,
    trail: [
      { label: "Keep what passes a test", onSelect: fn(), state: "done" },
      { label: "Compare a field", onSelect: fn(), state: "current" },
      { label: "Take one field", state: "todo" },
      { label: "On your own", state: "todo" },
    ],
  },
};

/** A review names no chapter, so nothing gives its pattern away. */
export const Review: Story = {
  args: {
    chapter: undefined,
    lesson: "NeetCode 150 · Review",
    onNext: undefined,
    onPrevious: undefined,
    position: "1 of 3",
    steps: { at: 0, count: 3 },
  },
};
