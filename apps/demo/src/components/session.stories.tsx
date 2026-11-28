import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Button,
  Card,
  CardColumns,
  CardStack,
  CodeEditor,
  Credit,
  CreditRow,
  Figure,
  Figures,
  Hero,
  IconButton,
  LengthPicker,
  OutputPanel,
  PlanRow,
  RunPanels,
  SessionBar,
  SessionHelp,
} from "@tech-prep/ui";
import { ArrowUp, RotateCcw, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { fn } from "storybook/test";

const meta = {
  args: {
    block: { icon: Sparkles, label: "New concept" },
    onToggleTutor: fn(),
    time: { label: "10 min left", used: 0.34 },
    tutorOpen: false,
  },
  component: SessionBar,
  decorators: [
    (Story) => (
      <div
        className="tp-session"
        style={{ height: "auto", padding: 24, width: 928 }}
      >
        <Story />
      </div>
    ),
  ],
  title: "Components/Session",
} satisfies Meta<typeof SessionBar>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The top bar names the block and the time left, and nothing about the course. */
export const Bar: Story = {};

/** A review is named only as a review. */
export const BarInReview: Story = {
  args: {
    actions: <Button variant="ghost">End session</Button>,
    block: { icon: RotateCcw, label: "Review" },
    tutorOpen: true,
  },
};

const Length = () => {
  const [minutes, setMinutes] = useState(15);

  return (
    <LengthPicker
      options={[5, 15, 25, 40]}
      value={minutes}
      onChange={setMinutes}
    />
  );
};

/** The opening of the Today screen: what comes next, and how long to study. */
export const Opening: Story = {
  render: () => (
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
      <Length />
      <Button variant="ghost">All concepts</Button>
    </Hero>
  ),
};

/** The session ahead, beside where the learner stands. */
export const Cards: Story = {
  render: () => (
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
          <Figures
            items={[
              { label: "Stable", value: 6 },
              { label: "Learning", value: 4 },
              { label: "To learn", value: 28 },
            ]}
          />
        </Card>
        <Card label="Memory">
          <Figure value="91%">of learned concepts you would recall now</Figure>
        </Card>
      </CardStack>
    </CardColumns>
  ),
};

/** The figures that close a session. */
export const Summary: Story = {
  render: () => (
    <Figures
      items={[
        { label: "minutes", value: 15 },
        { label: "new concept", value: 1 },
        { label: "concepts reviewed", value: 3 },
        { label: "right first time", value: "5 of 6" },
      ]}
      large
    />
  ),
};

/** What a task shows to work from, with the help above it. */
export const Panels: Story = {
  render: () => (
    <>
      <SessionHelp>
        <Button>Hint</Button>
        <Button>I don&apos;t know</Button>
      </SessionHelp>
      <RunPanels>
        <OutputPanel
          file="data.json"
          label="Input"
          text={'[\n  {"id": 1, "total": 80},\n  {"id": 2, "total": 20}\n]'}
        />
        <OutputPanel
          label="Your output"
          state="differs"
          text={'{"id": 1, "total": 80}\n{"id": 2, "total": 20}'}
        />
        <OutputPanel label="Wanted output" text='{"id": 1, "total": 80}' />
      </RunPanels>
    </>
  ),
};

/** The answer at the foot of a task: the editor as a card, with the way to hand in inside it. */
export const Answer: Story = {
  render: () => (
    <CodeEditor
      card
      compact
      file="answer"
      initialValue="jq '.[]' data.json"
      language="shell"
      status={
        <>
          <span className="tp-editor-status__note">Runs as you type</span>
          <IconButton icon={ArrowUp} label="Submit" />
        </>
      }
    />
  ),
};

/** What a finished task practised. A review names its concepts only here. */
export const Practised: Story = {
  render: () => (
    <Credit title="This task practised 3 concepts">
      <CreditRow
        effect="reviewed · next in 3 days"
        name="One item at a time"
        tone="pass"
      />
      <CreditRow
        effect="comes back tomorrow"
        name="Compare two values"
        tone="fail"
      />
      <CreditRow
        effect="learning"
        name="Keep items with select"
        tone="learning"
      />
    </Credit>
  ),
};
