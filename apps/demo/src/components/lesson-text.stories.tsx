import type { Meta, StoryObj } from "@storybook/react-vite";
import { LessonText } from "@tech-prep/ui";

const PART = `**Input**

\`\`\`json
{"user": {"name": "Ada", "langs": ["ts", "go"]}}
\`\`\`

**Filter**

\`\`\`jq
.user | .langs
\`\`\`

**Output**

\`\`\`json
["ts", "go"]
\`\`\`

\`\`\`steps
.user => {"name": "Ada", "langs": ["ts", "go"]}
.user «| .langs» => ["ts", "go"]
\`\`\`

**Rule:** \`a | b\` runs \`a\`, then runs \`b\` on what \`a\` gave.

\`.user.langs\` gives the same result. For paths, the dot does the job of the pipe.

**Common mistake:** No single quotes around the filter.

**Wrong**

\`\`\`sh
jq .user | .langs data.json
\`\`\`

**Error**

\`\`\`text
jq: error: Could not open file |: No such file or directory
\`\`\`

**Fix**

\`\`\`sh
jq «'».user | .langs«'» data.json
\`\`\`
`;

const SEVERAL = `**Input**

\`\`\`json
[{"name": "Ada", "age": 36}, {"name": "Bo", "age": 15}]
\`\`\`

**Filter**

\`\`\`jq
.[] | .name
\`\`\`

**Output**

\`\`\`json
"Ada"
"Bo"
\`\`\`

\`\`\`steps
.[] => {"name": "Ada", "age": 36} ;; {"name": "Bo", "age": 15}
.[] «| .name» => "Ada" ;; "Bo"
\`\`\`

**Rule:** \`.[]\` gives each item as its own output. The next step runs once for each.
`;

const PROSE = `Some answers must follow a rule. Check the rule before each choice.

## Worked example

\`\`\`ts
function build(text: string): void {
  if (text.length === 3) {
    results.push(text);
    return;
  }
  build(text + "a");
}
\`\`\`

## Why it works

- The \`if\` runs before the choice.
- One skipped choice removes a whole branch.
`;

const meta = {
  args: {
    text: PART,
    title: "The output of one step is the input of the next",
  },
  component: LessonText,
  decorators: [
    (Story) => (
      <div style={{ background: "var(--color-panel)", width: 900 }}>
        <Story />
      </div>
    ),
  ],
  title: "Components/Lesson text",
} satisfies Meta<typeof LessonText>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The fixed blocks of a part: example with steps, rule, a note, and the common mistake. */
export const Part: Story = {};

/** A step that gives several outputs shows one per line. */
export const SeveralOutputs: Story = {
  args: { text: SEVERAL, title: "One item at a time" },
};

/** A lesson with nothing to run: headings, paragraphs, a list and code. */
export const Prose: Story = {
  args: { text: PROSE, title: "Pruning with Constraints" },
};
