import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chapter, CourseHeader, CourseNav, Lesson } from "@tech-prep/ui";

import { SampleNav, SampleRail } from "../fixtures";

const Navigation = () => (
  <div style={{ display: "flex", height: 640 }}>
    <SampleRail />
    <SampleNav current={1} />
  </div>
);

const meta = {
  component: Navigation,
  parameters: { layout: "fullscreen" },
  title: "Components/Navigation",
} satisfies Meta<typeof Navigation>;

export default meta;

export const RailAndLessons: StoryObj<typeof meta> = {};

export const LessonStates: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ height: 420 }}>
      <CourseNav
        header={
          <CourseHeader
            meta="2 of 6 lessons"
            progress={2 / 6}
            title="Lesson states"
          />
        }
      >
        <Chapter current meta="2 / 6" open label="Every state">
          <Lesson label="Done" meta="Easy" status="done" />
          <Lesson label="Done with help" meta="Medium" status="partial" />
          <Lesson
            current
            label="Current"
            meta="Medium"
            selected
            status="started"
          />
          <Lesson label="Started" meta="Hard" status="started" />
          <Lesson label="Not started" meta="Easy" status="todo" />
          <Lesson label="Locked" meta="Hard" status="locked" />
        </Chapter>
      </CourseNav>
    </div>
  ),
};
