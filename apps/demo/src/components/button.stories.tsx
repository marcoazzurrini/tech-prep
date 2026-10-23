import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, IconButton } from "@tech-prep/ui";
import { ChevronLeft, MessageCircle, X } from "lucide-react";

const meta = {
  args: { children: "Show hint" },
  component: Button,
  title: "Components/Button",
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { children: "Submit", variant: "primary" },
};

export const Secondary: Story = {};

export const Ghost: Story = {
  args: { children: "Ask the tutor", icon: MessageCircle, variant: "ghost" },
};

export const Disabled: Story = {
  args: { children: "Submit", disabled: true, variant: "primary" },
};

export const IconButtons: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <IconButton icon={ChevronLeft} label="Previous lesson" />
      <IconButton icon={X} label="Close" variant="ghost" />
    </div>
  ),
};
