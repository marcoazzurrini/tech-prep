import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AppShell,
  Button,
  Card,
  CardColumns,
  CardStack,
  CodeBlock,
  CodeEditor,
  Credit,
  CreditRow,
  Figure,
  Figures,
  Hero,
  HeroNote,
  IconButton,
  LengthPicker,
  LessonText,
  List,
  ListRow,
  OutputPanel,
  Page,
  PageLabel,
  PlanRow,
  ProblemStatement,
  Progress,
  RunPanels,
  SessionActions,
  SessionBar,
  SessionBody,
  SessionHelp,
  SessionNote,
  SessionPane,
  TaskStrip,
} from "@tech-prep/ui";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUp,
  BookOpen,
  Check,
  RotateCcw,
  Sparkles,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import { fn } from "storybook/test";

import { SampleRail } from "../fixtures";

const Shell = ({ children }: { children: ReactNode }) => (
  <div style={{ height: 900 }}>
    <AppShell rail={<SampleRail />}>
      <SessionPane>{children}</SessionPane>
    </AppShell>
  </div>
);

const meta = {
  component: Shell,
  parameters: { layout: "fullscreen" },
  title: "Screens/Session",
} satisfies Meta<typeof Shell>;

export default meta;

type Story = StoryObj<typeof meta>;

const LESSON = `**Input**

\`\`\`json
[{"name": "Ada", "age": 36}, {"name": "Bo", "age": 15}, {"name": "Cy", "age": 52}]
\`\`\`

\`\`\`steps
.[] => {"name": "Ada", "age": 36} ;; {"name": "Bo", "age": 15} ;; {"name": "Cy", "age": 52}
.[] «| select(.age >= 18)» => {"name": "Ada", "age": 36} ;; {"name": "Cy", "age": 52}
\`\`\`

**Rule:** \`select(test)\` passes its input on when the test is true. Otherwise it gives no output.`;

const INPUT = `[
  {"id": 1, "total": 80},
  {"id": 2, "total": 20},
  {"id": 3, "total": 65}
]`;

const ALL = `{"id": 1, "total": 80}
{"id": 2, "total": 20}
{"id": 3, "total": 65}`;

const WANTED = `{"id": 1, "total": 80}
{"id": 3, "total": 65}`;

const STUB = `export function getConcatenation(nums: number[]): number[] {
  throw new Error("not implemented");
}
`;

interface BarProps {
  icon: LucideIcon;
  label: string;
  left: string;
  used: number;
}

const Bar = ({ icon, label, left, used }: BarProps) => (
  <SessionBar
    actions={<Button variant="ghost">End session</Button>}
    block={{ icon, label }}
    time={{ label: left, used }}
    onToggleTutor={fn()}
  />
);

const Strip = () => (
  <TaskStrip title="Give every order with a total over 50.">
    <ProblemStatement text="Print one order on each line." />
  </TaskStrip>
);

interface AnswerProps {
  text: string;
  note: string;
  /** A file name makes it a long answer in that file. */
  file?: string;
}

const Answer = ({ text, note, file }: AnswerProps) => (
  <CodeEditor
    card
    compact={!file}
    file={file ?? "answer"}
    initialValue={text}
    language={file ? "typescript" : "shell"}
    status={
      <>
        <span className="tp-editor-status__note">{note}</span>
        <IconButton icon={ArrowUp} label="Submit" />
      </>
    }
  />
);

/** What today's session holds, and where the learner stands. No course outline is shown. */
export const Today: Story = {
  args: {
    children: (
      <>
        <SessionBar />
        <SessionBody centred>
          <Hero
            chip={
              <>
                <b>Good morning.</b> Day 12
              </>
            }
            lead="3 concepts to review, then this new one."
            title="Keep items with select"
          >
            <Button variant="primary">Start session</Button>
            <LengthPicker
              options={[5, 15, 25, 40]}
              value={15}
              onChange={fn()}
            />
            <Button variant="ghost">All concepts</Button>
          </Hero>
          <CardColumns>
            <Card>
              <PlanRow
                detail="3 concepts are due. 2 tasks cover them."
                icon={RotateCcw}
                title="Review"
              />
              <PlanRow
                detail="See the example, then 3 short tasks."
                icon={Sparkles}
                title="New concept"
              />
              <PlanRow
                detail="2 tasks with the lesson closed."
                icon={User}
                title="On your own"
              />
            </Card>
            <CardStack>
              <Card label="Progress in jq" title="10 of 38 concepts">
                <Progress label="Concepts learned" value={10 / 38} />
                <Figures
                  items={[
                    { label: "Stable", value: 6 },
                    { label: "Learning", value: 4 },
                    { label: "To learn", value: 28 },
                  ]}
                />
              </Card>
              <Card label="Memory">
                <Figure value="91%">
                  of learned concepts you would recall now
                </Figure>
              </Card>
            </CardStack>
          </CardColumns>
        </SessionBody>
      </>
    ),
  },
};

/** One part of a concept: its example and its rule, alone on screen. */
export const SeeIt: Story = {
  args: {
    children: (
      <>
        <Bar
          icon={Sparkles}
          label="New concept"
          left="11 min left"
          used={0.26}
        />
        <SessionBody
          footer={
            <SessionActions>
              <Button variant="primary">Continue ↵</Button>
            </SessionActions>
          }
        >
          <LessonText text={LESSON} title="Keep only some items" />
        </SessionBody>
      </>
    ),
  },
};

/** The task for the part just read. The output runs as the learner types. */
export const TryIt: Story = {
  args: {
    children: (
      <>
        <Bar
          icon={Sparkles}
          label="New concept"
          left="10 min left"
          used={0.34}
        />
        <SessionBody
          footer={<Answer note="Runs as you type" text="jq '.[]' data.json" />}
        >
          <Strip />
          <SessionHelp>
            <Button icon={BookOpen}>Open the lesson</Button>
            <Button>Hint</Button>
            <Button>I don&apos;t know</Button>
          </SessionHelp>
          <RunPanels>
            <OutputPanel file="data.json" label="Input" text={INPUT} />
            <OutputPanel label="Your output" state="differs" text={ALL} />
            <OutputPanel label="Wanted output" text={WANTED} />
          </RunPanels>
        </SessionBody>
      </>
    ),
  },
};

/** After the answer: how it went, and what the task practised. */
export const Right: Story = {
  args: {
    children: (
      <>
        <Bar icon={RotateCcw} label="Review" left="9 min left" used={0.4} />
        <SessionBody
          footer={
            <SessionActions start={<Button>Why does this work?</Button>}>
              <Button variant="primary">Continue ↵</Button>
            </SessionActions>
          }
        >
          <Strip />
          <CodeBlock
            code="jq '.[] | select(.total > 50)' data.json"
            lineNumbers
          />
          <RunPanels>
            <OutputPanel label="Your output" state="matches" text={WANTED} />
          </RunPanels>
          <SessionNote>
            <b>Right on try 2.</b>
          </SessionNote>
          <Credit title="This task practised 2 concepts">
            <CreditRow
              effect="reviewed · next in 3 days"
              name="One item at a time"
              tone="pass"
            />
            <CreditRow
              effect="reviewed · next in 14 days"
              name="Compare two values"
              tone="pass"
            />
          </Credit>
        </SessionBody>
      </>
    ),
  },
};

/** A task of many lines: the editor takes the room, and the help stays above it. */
export const OnYourOwn: Story = {
  args: {
    children: (
      <>
        <Bar icon={User} label="On your own" left="5 min left" used={0.67} />
        <SessionBody
          footer={
            <>
              <SessionHelp>
                <Button icon={BookOpen}>Open the lesson</Button>
                <Button>Hint</Button>
                <Button>Give up</Button>
              </SessionHelp>
              <Answer
                file="concatenation-of-array.ts"
                note=":w runs the tests"
                text={STUB}
              />
            </>
          }
          grow
        >
          <TaskStrip title="Concatenation of Array">
            <ProblemStatement text="Given an integer array `nums` of length `n`, return a new array of length `2n`. It holds the items of `nums` in order, followed by the items of `nums` in order again." />
          </TaskStrip>
        </SessionBody>
      </>
    ),
  },
};

/** The closing summary. The session ends after the task that used up the time. */
export const Done: Story = {
  args: {
    children: (
      <>
        <SessionBar
          block={{ icon: Check, label: "Done" }}
          time={{ label: "15 min", used: 1 }}
          onToggleTutor={fn()}
        />
        <SessionBody
          centred
          footer={
            <SessionActions centred>
              <Button variant="primary">Finish ↵</Button>
            </SessionActions>
          }
        >
          <Hero lead="Your time is up." title="Done." />
          <Figures
            items={[
              { label: "minutes", value: 15 },
              { label: "new concept", value: 1 },
              { label: "concepts reviewed", value: 3 },
              { label: "right first time", value: "5 of 6" },
            ]}
            large
          />
          <HeroNote>
            Keep items with select comes back tomorrow, inside a review.
          </HeroNote>
        </SessionBody>
      </>
    ),
  },
};

/** Every concept with where it stands. A learned one can be read again. */
export const Concepts: Story = {
  args: {
    children: (
      <>
        <SessionBar actions={<Button variant="ghost">Back to today</Button>} />
        <Page
          lead="2 of 38 learned. A session teaches them in order."
          title="jq concepts"
        >
          <PageLabel>First steps</PageLabel>
          <List>
            <ListRow
              detail="Learned · review in 3 days"
              end={<Button>Read</Button>}
              title="What jq Does"
            />
            <ListRow
              detail="Learned · review tomorrow"
              end={<Button>Read</Button>}
              title="Reading JSON"
            />
            <ListRow detail="Learning" title="Read a Value from an Object" />
            <ListRow detail="Locked" title="Go Deeper with a Path" />
          </List>
        </Page>
      </>
    ),
  },
};
