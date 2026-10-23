import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge, Chip, Progress } from "@tech-prep/ui";
import { Eye } from "lucide-react";

const Indicators = () => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: 24, width: 360 }}
  >
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <Chip tone="green">Correct</Chip>
      <Chip tone="amber">2 of 3 right</Chip>
      <Chip tone="red">Wrong output</Chip>
      <Chip muted>Learning</Chip>
      <Chip icon={Eye}>Uniqueness rule</Chip>
    </div>
    <div style={{ display: "flex", gap: 8 }}>
      <Badge active initials="TS" />
      <Badge initials="jq" />
      <Badge initials="75" />
      <Badge active initials="TS" size="sm" />
    </div>
    <Progress label="TypeScript progress" value={0.38} />
  </div>
);

const meta = {
  component: Indicators,
  title: "Components/Chips, badges and progress",
} satisfies Meta<typeof Indicators>;

export default meta;

export const All: StoryObj<typeof meta> = {};
