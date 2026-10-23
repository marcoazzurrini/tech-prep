import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AppShell,
  Chip,
  EmptyState,
  LessonPane,
  PaneBody,
  ProblemStatement,
  TaskHeader,
  TopBar,
} from "@tech-prep/ui";
import { fn } from "storybook/test";

import { SampleNav, SampleRail } from "../fixtures";

const STATEMENT = `# Contains Duplicate (easy)

Given an integer array \`nums\`, return \`true\` if any value appears at least twice, and \`false\` if every element is distinct.

Example 1: nums = [1, 2, 3, 1]  ->  true
Example 2: nums = [1, 2, 3, 4]  ->  false

Constraints: 0 <= len(nums) <= 10^5, values fit in a 32-bit integer.`;

/** A Blind 75 problem as the desktop app shows it: the statement, solved with the tutor. */
const ProblemScreen = ({ empty }: { empty: boolean }) => (
  <AppShell nav={<SampleNav current={1} />} rail={<SampleRail />}>
    <LessonPane>
      <TopBar
        chapter="Arrays & Hashing"
        lesson="Contains Duplicate"
        position="Problem 1 of 9"
        tutorOpen={false}
        onNext={fn()}
        onToggleTutor={fn()}
      />
      <PaneBody>
        {empty ? (
          <EmptyState title="Nothing to do right now">
            Your next review is on Friday 24 October.
          </EmptyState>
        ) : (
          <>
            <TaskHeader
              chips={
                <>
                  <Chip muted>Easy</Chip>
                  <Chip>Learn</Chip>
                </>
              }
              title="Contains Duplicate"
            />
            <ProblemStatement text={STATEMENT} />
          </>
        )}
      </PaneBody>
    </LessonPane>
  </AppShell>
);

const meta = {
  args: { empty: false },
  component: ProblemScreen,
  decorators: [
    (Story) => (
      <div style={{ height: "100%" }}>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: "fullscreen" },
  title: "Screens/Problem",
} satisfies Meta<typeof ProblemScreen>;

export default meta;

export const Statement: StoryObj<typeof meta> = {};

export const NothingDue: StoryObj<typeof meta> = { args: { empty: true } };
