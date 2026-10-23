import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AnswerInput,
  AppShell,
  Button,
  Chip,
  CodeBlock,
  Composer,
  EditorStatus,
  LessonPane,
  LineSlot,
  Message,
  PaneBody,
  PaneFooter,
  PaneSection,
  TaskHeader,
  TestRow,
  TopBar,
  TutorPane,
} from "@tech-prep/ui";
import type { ReactNode } from "react";
import { useState } from "react";
import { fn } from "storybook/test";

import { SampleNav, SampleRail } from "../fixtures";

type Exercise = "predict" | "arrange" | "write";

const LESSON = {
  arrange: { index: 2, title: "Insertion order" },
  predict: { index: 1, title: "Uniqueness rule" },
  write: { index: 3, title: "Write uniqueBy" },
};

const UNIQUE_BY = `export function uniqueBy<T, K>(
  items: T[],
  key: (t: T) => K,
): T[] {
  const seen = new Set<K>();
  return items.filter((t) => {
    const k = key(t);
    if (seen.has(k)) return false;
    return true;
  });
}`;

const learning = <Chip tone="amber">Uniqueness rule · Learning</Chip>;
const insertion = <Chip muted>Insertion order</Chip>;

const Predict = () => (
  <>
    <PaneBody>
      <TaskHeader
        chips={learning}
        description="A Set keeps each value once. What does this print?"
        title="Predict the output"
      />
      <CodeBlock
        code={
          'const s = new Set([1, "1", NaN, NaN, {}, {}]);\nconsole.log(s.size);'
        }
      />
      <PaneSection label="Your answer">
        <AnswerInput aria-label="Your answer" defaultValue="4" />
      </PaneSection>
    </PaneBody>
    <PaneFooter>
      <Button>Show hint</Button>
      <Button variant="primary">Submit</Button>
    </PaneFooter>
  </>
);

const Arrange = () => (
  <>
    <PaneBody>
      <TaskHeader
        chips={
          <>
            {insertion}
            {learning}
          </>
        }
        description="Order the lines so it logs each tag once, in the order first seen. One line is not needed."
        title="Arrange the lines"
      />
      <PaneSection>
        <LineSlot code="const seen = new Set();" index={1} />
        <LineSlot code="for (const t of tags) seen.add(t);" index={2} />
        <LineSlot code="for (const t of seen) console.log(t);" index={3} />
      </PaneSection>
      <PaneSection label="Not needed">
        <LineSlot code="seen.sort();" spare />
      </PaneSection>
    </PaneBody>
    <PaneFooter>
      <Button>Show hint</Button>
      <Button variant="primary">Submit</Button>
    </PaneFooter>
  </>
);

const Write = () => (
  <>
    <TaskHeader
      chips={
        <>
          {learning}
          {insertion}
        </>
      }
      description="Return the items whose key you have not seen before, in their original order."
      title="Write uniqueBy"
    />
    <CodeBlock code={UNIQUE_BY} currentLine={8} grow lineNumbers />
    <EditorStatus cursor="8:34" file="unique-by.ts" mode="NORMAL" />
    <PaneSection label="Tests · not run yet">
      <TestRow name="keeps the first item for each key" status="pending" />
      <TestRow name="keeps the original order" status="pending" />
      <TestRow name="returns [] for an empty list" status="pending" />
      <TestRow name="drops later duplicates" status="pending" />
    </PaneSection>
    <PaneFooter>
      <Button>Run tests</Button>
      <Button variant="primary">Submit</Button>
    </PaneFooter>
  </>
);

const EXERCISE: Record<Exercise, () => ReactNode> = {
  arrange: Arrange,
  predict: Predict,
  write: Write,
};

const SampleTutor = ({ onClose }: { onClose: () => void }) => {
  const [draft, setDraft] = useState("");

  return (
    <TutorPane
      composer={
        <Composer
          value={draft}
          onChange={setDraft}
          onSend={() => setDraft("")}
        />
      }
      context="Uniqueness rule"
      onClose={onClose}
    >
      <Message from="tutor">
        This one is about how a Set decides two values are the same. Make a
        guess before you submit.
      </Message>
      <Message from="learner">
        Why would NaN count once? I thought NaN !== NaN.
      </Message>
      <Message from="tutor">
        Good catch: === says NaN is not equal to itself. A Set compares with
        SameValueZero instead, where NaN does equal NaN.
      </Message>
      <Message from="tutor">
        I won’t give you the count. Look at the two {"{}"} next: are they the
        same object?
      </Message>
    </TutorPane>
  );
};

const CourseScreen = ({
  exercise,
  tutor,
}: {
  exercise: Exercise;
  tutor: boolean;
}) => {
  const [open, setOpen] = useState(tutor);
  const lesson = LESSON[exercise];
  const Body = EXERCISE[exercise];

  return (
    <AppShell
      nav={<SampleNav current={lesson.index} />}
      rail={<SampleRail />}
      tutor={<SampleTutor onClose={() => setOpen(false)} />}
      tutorOpen={open}
    >
      <LessonPane>
        <TopBar
          chapter="Sets"
          lesson={lesson.title}
          position={`Lesson ${lesson.index + 1} of 5`}
          tutorOpen={open}
          onNext={fn()}
          onPrevious={fn()}
          onToggleTutor={() => setOpen((o) => !o)}
        />
        <Body />
      </LessonPane>
    </AppShell>
  );
};

const meta = {
  argTypes: {
    exercise: {
      control: "inline-radio",
      options: ["predict", "arrange", "write"],
    },
  },
  args: { exercise: "predict", tutor: false },
  component: CourseScreen,
  decorators: [
    (Story) => (
      <div style={{ height: "100vh" }}>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "fullscreen" },
  title: "Screens/Course",
} satisfies Meta<typeof CourseScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PredictTheOutput: Story = {};

export const ArrangeTheLines: Story = { args: { exercise: "arrange" } };

export const WriteCode: Story = { args: { exercise: "write" } };

export const WithTutor: Story = { args: { tutor: true } };
