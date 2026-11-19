import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AppShell,
  Badge,
  Button,
  Chapter,
  Chip,
  CodeEditor,
  Count,
  CourseHeader,
  CourseNav,
  Lesson,
  LessonPane,
  LessonText,
  List,
  ListRow,
  Page,
  PageActions,
  PageLabel,
  PageNote,
  PaneBody,
  PaneFooter,
  PaneSection,
  ProblemStatement,
  Rail,
  RailDivider,
  RailItem,
  ResultCard,
  Split,
  SplitSide,
  TaskHeader,
  TaskText,
  TestRow,
  TopBar,
  YourTurn,
} from "@tech-prep/ui";
import { ArrowRight, BookOpen, CalendarCheck, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { fn } from "storybook/test";

const LESSON = `# Canonical Keys

Some items look different but belong together. Give each item a key that is the same for every item of its group. Then keep a map from the key to the list of items with that key.

## Worked example

Group words by their first letter. The first letter is the key.

\`\`\`ts
const groups = new Map<string, string[]>();

for (const word of ["apple", "avocado", "banana"]) {
  const key = word[0];
  const group = groups.get(key) ?? [];
  group.push(word);
  groups.set(key, group);
}

// groups: "a" has apple and avocado, "b" has banana
\`\`\`

## Why it works

- Items with the same key land in the same list, in one pass over the input.
- \`?? []\` starts a new list the first time a key appears.
- \`groups.set\` stores the list back. A new list is not in the map until you set it.

## When to use it

- The task says "group", or asks which items are equivalent.
- You can describe what the items of a group share. That description becomes the key.`;

const GUIDED = `Given a list of words, group the words that have the same length. Return the groups in any order.

Example 1: words = ["a", "bb", "cc"]  ->  [["a"], ["bb", "cc"]]`;

const ANAGRAMS = `Given a list of strings \`strs\`, group the strings that are anagrams of each other. Return the groups in any order.

Example 1: strs = ["eat", "tea", "tan", "ate"]  ->  [["tan"], ["ate", "eat", "tea"]]
Example 2: strs = [""]  ->  [[""]]

Constraints: 1 <= len(strs) <= 10^4, lowercase English letters.`;

const TOP_K = `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent values. You may return them in any order.

Example 1: nums = [1, 1, 1, 2, 2, 3], k = 2  ->  [1, 2]
Example 2: nums = [7], k = 1  ->  [7]

Constraints: 1 <= len(nums) <= 10^5.`;

const GROUP_BY_LENGTH = `export function groupByLength(words: string[]): string[][] {
  const groups = new Map<number, string[]>();
  for (const word of words) {
    const group = groups.get(word.length) ?? [];
    group.push(word);
  }
  return [...groups.values()];
}`;

const TOP_K_CODE = `export function topKFrequent(nums: number[], k: number): number[] {
  const counts = new Map<number, number>();
  for (const n of nums) {
    counts.set(n, (counts.get(n) ?? 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, k).map(([n]) => n);
}`;

const CONCEPTS = [
  "Dynamic Arrays",
  "Hash Set Lookup",
  "Frequency Counting",
  "Value-to-Index Map",
  "Canonical Keys",
  "Bucket Sort by Count",
  "Prefix and Suffix Accumulation",
  "String Encoding",
  "Sequence Starts",
];

/** The lessons column: concepts as lessons, with the fifth one current. */
const Nav = () => (
  <CourseNav
    header={
      <CourseHeader
        meta="4 of 89 concepts · 3 of 150 problems"
        progress={4 / 89}
        title="DSA"
      />
    }
  >
    <Chapter current meta="4 / 9" open label="1  Arrays & Hashing">
      {CONCEPTS.map((name, i) => (
        <Lesson
          current={i === 4}
          key={name}
          label={name}
          selected={i === 4}
          status={i < 4 ? "done" : "todo"}
        />
      ))}
    </Chapter>
    <Chapter label="2  Two Pointers" meta="0 / 3" />
    <Chapter label="3  Stack" meta="0 / 4" />
    <Chapter label="4  Sliding Window" meta="0 / 5" />
    <Chapter label="5  Binary Search" meta="0 / 5" />
  </CourseNav>
);

const SampleRail = ({ reviews = false }: { reviews?: boolean }) => (
  <Rail>
    <RailItem active={reviews} count={3} label="Reviews">
      <CalendarCheck size={16} />
    </RailItem>
    <RailDivider />
    <RailItem active={!reviews} label="DSA">
      <Badge active={!reviews} initials="DSA" />
    </RailItem>
    <RailItem label="TypeScript">
      <Badge initials="TS" />
    </RailItem>
  </Rail>
);

const Frame = ({
  children,
  focus = false,
}: {
  children: ReactNode;
  /** A focused screen: no lessons column. */
  focus?: boolean;
}) => (
  <AppShell
    nav={focus ? undefined : <Nav />}
    rail={<SampleRail reviews={focus} />}
  >
    <LessonPane>{children}</LessonPane>
  </AppShell>
);

const lessonText = (turn: boolean) => (
  <LessonText
    label={<Chip icon={BookOpen}>Lesson</Chip>}
    text={LESSON}
    title="Canonical Keys"
  >
    {turn && (
      <YourTurn
        label="Your turn · with the lesson"
        title="Group Words by Length"
      >
        <ProblemStatement text={GUIDED} />
      </YourTurn>
    )}
  </LessonText>
);

const workFooter = (
  <PaneFooter start={<Button variant="ghost">Give up</Button>}>
    <Button>Show hint</Button>
    <Button>Run tests</Button>
    <Button variant="primary">Submit</Button>
  </PaneFooter>
);

/** Step 1: the lesson beside a small guided problem. */
const Guided = () => (
  <Frame>
    <TopBar
      chapter="Arrays & Hashing"
      lesson="Canonical Keys"
      position="Step 1 of 2 · With the lesson"
      steps={{ at: 0, count: 2 }}
      tutorOpen={false}
      onToggleTutor={fn()}
    />
    <Split>
      <SplitSide>{lessonText(true)}</SplitSide>
      <SplitSide stack>
        <CodeEditor
          file="guided-canonical-key.ts"
          initialValue={GROUP_BY_LENGTH}
          language="typescript"
        />
        <PaneSection dock label="Tests · 1 of 4 passed">
          <TestRow
            detail='["a","bb","cc"] → expected [["a"],["bb","cc"]], got []'
            name="Case 1"
            status="fail"
          />
          <TestRow name="Case 2" status="pass" />
        </PaneSection>
        {workFooter}
      </SplitSide>
    </Split>
  </Frame>
);

/** Step 2: the solo problem, with the lesson closed. */
const Solo = ({ solved = false }: { solved?: boolean }) => (
  <Frame>
    <TopBar
      actions={<Button icon={BookOpen}>Lesson</Button>}
      chapter="Arrays & Hashing"
      lesson="Canonical Keys"
      position="Step 2 of 2 · On your own"
      steps={{ at: 1, count: 2 }}
      tutorOpen={false}
      onToggleTutor={fn()}
    />
    <PaneBody share>
      <TaskHeader
        chips={
          <>
            <Chip muted>Medium</Chip>
            {solved && <Chip>Solved</Chip>}
            {solved && <Chip tone="green">Canonical Keys · Learned</Chip>}
          </>
        }
        title="Group Anagrams"
      />
      <ProblemStatement text={ANAGRAMS} />
    </PaneBody>
    <CodeEditor
      file="group-anagrams.ts"
      initialValue={
        'export function groupAnagrams(strs: string[]): string[][] {\n  throw new Error("not implemented");\n}'
      }
      language="typescript"
    />
    <PaneSection
      dock
      label={solved ? "Tests · 4 of 4 passed" : "Tests · not run yet"}
    >
      {solved && <TestRow name="Case 1" status="pass" />}
      {solved && <TestRow name="Case 2" status="pass" />}
    </PaneSection>
    {solved ? (
      <PaneFooter
        start={
          <span className="tp-pane-footer__note">
            Solved without help. Canonical Keys is learned. Its first review is
            tomorrow.
          </span>
        }
      >
        <Button variant="primary">Next lesson</Button>
      </PaneFooter>
    ) : (
      <PaneFooter
        start={
          <>
            <Button variant="ghost">Give up</Button>
            <span className="tp-pane-footer__note">
              The lesson is closed. Opening it counts as help.
            </span>
          </>
        }
      >
        <Button>Show hint</Button>
        <Button>Run tests</Button>
        <Button variant="primary">Submit</Button>
      </PaneFooter>
    )}
  </Frame>
);

/** What the calendar icon opens: what is due, per track. */
const Reviews = () => (
  <Frame focus>
    <TopBar lesson="Reviews" tutorOpen={false} onToggleTutor={fn()} />
    <Page
      eyebrow="Thursday 19 November"
      lead="3 reviews due today, in 2 tracks."
      title="Reviews"
    >
      <PageActions note="3 problems, mixed across tracks · about 35 min">
        <Button iconEnd={ArrowRight} size="large" variant="primary">
          Review all
        </Button>
      </PageActions>
      <PageLabel>Or one track</PageLabel>
      <List>
        <ListRow
          detail="2 problems · about 25 min"
          end={
            <>
              <Count>2 due</Count>
              <Button iconEnd={ArrowRight}>Start</Button>
            </>
          }
          start={<Badge active initials="DSA" />}
          title="DSA"
        />
        <ListRow
          detail="1 problem · about 10 min"
          end={
            <>
              <Count>1 due</Count>
              <Button iconEnd={ArrowRight}>Start</Button>
            </>
          }
          start={<Badge active initials="TS" />}
          title="TypeScript"
        />
        <ListRow
          detail="Next review on Saturday 21 November"
          end="Nothing due"
          start={<Badge active initials="jq" />}
          title="jq"
        />
      </List>
      <PageNote>
        A review is a problem you solve without the lesson. It does not say
        which lesson it comes from.
      </PageNote>
    </Page>
  </Frame>
);

/** A review: a full problem, with nothing that names its approach. */
const Review = ({ verdict = false }: { verdict?: boolean }) => (
  <Frame focus>
    <TopBar
      actions={<Button variant="ghost">End reviews</Button>}
      lesson="DSA · Review"
      position="1 of 2"
      steps={{ at: 0, count: 2 }}
      tutorOpen={false}
      onToggleTutor={fn()}
    />
    <Split>
      <SplitSide>
        <TaskText
          chips={
            <>
              <Chip icon={RotateCcw} muted>
                Review 1 of 2
              </Chip>
              <Chip muted>Medium</Chip>
            </>
          }
          title="Top K Frequent Elements"
        >
          <ProblemStatement text={TOP_K} />
          {verdict && (
            <ResultCard title="Solved with help" tone="amber">
              <p>
                You needed help to choose the approach, so this comes back soon.
              </p>
              <div className="tp-result__chips">
                <Chip tone="amber">
                  Frequency Counting · next review tomorrow
                </Chip>
                <Chip tone="green">
                  Bucket Sort by Count · next review in 4 days
                </Chip>
              </div>
              <div>
                <h4>The approach</h4>
                <p>
                  Count how often each item appears with a hash map, in one
                  pass.
                </p>
                <Button icon={BookOpen} variant="ghost">
                  Open the lesson: Frequency Counting
                </Button>
              </div>
            </ResultCard>
          )}
        </TaskText>
      </SplitSide>
      <SplitSide stack>
        <CodeEditor
          file="top-k-frequent-elements.ts"
          initialValue={TOP_K_CODE}
          language="typescript"
        />
        <PaneSection
          dock
          label={verdict ? "Tests · 4 of 4 passed" : "Tests · not run yet"}
        >
          {verdict && <TestRow name="Case 1" status="pass" />}
        </PaneSection>
        {verdict ? (
          <PaneFooter>
            <Button>Ask the tutor</Button>
            <Button variant="primary">Next review</Button>
          </PaneFooter>
        ) : (
          workFooter
        )}
      </SplitSide>
    </Split>
  </Frame>
);

type Screen =
  | "guided"
  | "solo"
  | "solved"
  | "reviews"
  | "review"
  | "review-verdict";

const LessonScreen = ({ screen }: { screen: Screen }) => {
  switch (screen) {
    case "guided": {
      return <Guided />;
    }

    case "solo": {
      return <Solo />;
    }

    case "solved": {
      return <Solo solved />;
    }

    case "reviews": {
      return <Reviews />;
    }

    case "review": {
      return <Review />;
    }

    default: {
      return <Review verdict />;
    }
  }
};

const meta = {
  args: { screen: "guided" },
  component: LessonScreen,
  decorators: [
    (Story) => (
      <div style={{ height: 900 }}>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "fullscreen" },
  title: "Screens/Lesson and reviews",
} satisfies Meta<typeof LessonScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GuidedProblem: Story = {};

export const SoloProblem: Story = { args: { screen: "solo" } };

export const SoloProblemSolved: Story = { args: { screen: "solved" } };

export const ReviewsDue: Story = { args: { screen: "reviews" } };

export const ReviewSolving: Story = { args: { screen: "review" } };

export const ReviewSolvedWithHelp: Story = {
  args: { screen: "review-verdict" },
};
