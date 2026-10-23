import type { Meta, StoryObj } from "@storybook/react-vite";

const groups: [string, string[]][] = [
  [
    "Surfaces",
    [
      "canvas",
      "sidebar",
      "surface",
      "panel",
      "hover",
      "card",
      "raised",
      "border",
      "border-strong",
    ],
  ],
  ["Text", ["ink", "body", "mute", "dim", "light", "on-light"]],
  ["Signal", ["accent", "accent-bg", "accent-line", "green", "amber", "red"]],
  [
    "Syntax",
    [
      "syntax-keyword",
      "syntax-string",
      "syntax-number",
      "syntax-comment",
      "syntax-function",
    ],
  ],
];

const Swatch = ({ name }: { name: string }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      width: 120,
    }}
  >
    <div
      style={{
        background: `var(--color-${name})`,
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        height: 56,
      }}
    />
    <span
      style={{
        color: "var(--color-ink)",
        font: "500 14px/20px var(--font-sans)",
      }}
    >
      {name}
    </span>
  </div>
);

const Colours = () => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}
  >
    {groups.map(([group, names]) => (
      <section
        key={group}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        <h2
          style={{
            color: "var(--color-mute)",
            font: "400 13px/18px var(--font-sans)",
            margin: 0,
          }}
        >
          {group}
        </h2>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)" }}
        >
          {names.map((name) => (
            <Swatch key={name} name={name} />
          ))}
        </div>
      </section>
    ))}
  </div>
);

const meta = {
  component: Colours,
  parameters: { layout: "padded" },
  title: "Foundations/Colours",
} satisfies Meta<typeof Colours>;

export default meta;

export const All: StoryObj<typeof meta> = {};
