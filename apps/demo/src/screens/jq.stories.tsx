import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Chip,
  CodeBlock,
  CodeEditor,
  LessonPane,
  LessonText,
  OutputPanel,
  OutputPanels,
  PaneFooter,
  ProblemStatement,
  Split,
  SplitSide,
  TaskStrip,
  TaskText,
  TopBar,
} from "@tech-prep/ui";
import { BookOpen, User } from "lucide-react";
import { fn } from "storybook/test";

const LESSON = `# Keep Items with select

\`select(test)\` passes a value on when the test is true. It drops the value when the test is false.

## Worked example

Give the titles of the books that cost less than 10.

**Filter**

\`\`\`jq
.[] | select(.price < 10) | .title
\`\`\`

## Why it works

- \`.[]\` gives one book at a time.
- \`select(.price < 10)\` keeps a book only when its price is under 10.
`;

const USERS = `[
  {"name": "Ada", "active": true},
  {"name": "Bo", "active": false},
  {"name": "Cy", "active": true}
]`;

const SHOP = `{
  "shop": "North",
  "items": [
    {"name": "pen", "stock": 3},
    {"name": "ink", "stock": 0}
  ]
}`;

type Screen = "guided" | "right" | "solo-error";

/** The jq lesson: several short tasks, each checked by its output. */
const JqScreen = ({ screen }: { screen: Screen }) => {
  const right = screen === "right";
  const solo = screen === "solo-error";

  return (
    <LessonPane>
      <TopBar
        trail={[
          { label: "Keep what passes a test", onSelect: fn(), state: "done" },
          {
            label: "Compare a field",
            onSelect: fn(),
            state: solo ? "done" : "current",
          },
          {
            label: "Take one field",
            onSelect: solo ? fn() : undefined,
            state: solo ? "done" : "todo",
          },
          { label: "On your own", state: solo ? "current" : "todo" },
        ]}
        tutorOpen={false}
        onToggleTutor={fn()}
      />
      <Split>
        <SplitSide>
          {solo ? (
            <TaskText
              chips={
                <>
                  <Chip icon={User}>On your own</Chip>
                  <Chip muted>Task 1 of 2</Chip>
                </>
              }
              title="Products in stock"
            >
              <ProblemStatement text="Give the name of every product that is in stock." />
              <p className="tp-task-text__label">Input</p>
              <CodeBlock code={SHOP} />
              <p className="tp-task-text__note">
                The lesson is closed. Opening it counts as help.
              </p>
            </TaskText>
          ) : (
            <LessonText
              label={<Chip icon={BookOpen}>Lesson</Chip>}
              text={LESSON}
              title="Keep Items with select"
            />
          )}
        </SplitSide>
        <SplitSide stack>
          {!solo && (
            <TaskStrip label="Try it" title="Active users">
              <ProblemStatement text="Give the name of every user who is active." />
            </TaskStrip>
          )}
          <CodeEditor
            compact
            file="filter.jq"
            initialValue={
              solo
                ? ".items | select(.stock > 0) | .name"
                : `.[] | select(.active)${right ? " | .name" : ""}`
            }
            key={screen}
            language="jq"
          />
          <OutputPanels
            input={
              solo ? undefined : <OutputPanel label="Input" text={USERS} />
            }
            wanted={
              <OutputPanel
                label="Wanted output"
                text={solo ? '"pen"' : '"Ada"\n"Cy"'}
              />
            }
            yours={
              solo ? (
                <OutputPanel
                  label="Your output"
                  state="error"
                  text='jq: error: Cannot index array with string "stock"'
                />
              ) : (
                <OutputPanel
                  label="Your output"
                  state={right ? "matches" : "differs"}
                  text={
                    right
                      ? '"Ada"\n"Cy"'
                      : '{\n  "name": "Ada",\n  "active": true\n}'
                  }
                />
              )
            }
          />
          {right ? (
            <PaneFooter
              start={
                <span className="tp-pane-footer__note">
                  Right. It also passed 3 hidden inputs.
                </span>
              }
            >
              <Button variant="primary">Next task</Button>
            </PaneFooter>
          ) : (
            <PaneFooter start={<Button variant="ghost">Give up</Button>}>
              <Button>Show hint</Button>
              <Button variant="primary">Submit</Button>
            </PaneFooter>
          )}
        </SplitSide>
      </Split>
    </LessonPane>
  );
};

const meta = {
  args: { screen: "guided" },
  component: JqScreen,
  decorators: [
    (Story) => (
      <div style={{ display: "flex", height: 900 }}>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "fullscreen" },
  title: "Screens/jq lesson",
} satisfies Meta<typeof JqScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GuidedTask: Story = {};

export const TaskRight: Story = { args: { screen: "right" } };

export const OnYourOwnWithAnError: Story = { args: { screen: "solo-error" } };
