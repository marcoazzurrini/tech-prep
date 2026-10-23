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
