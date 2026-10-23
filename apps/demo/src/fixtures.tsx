import {
  Badge,
  Chapter,
  CourseHeader,
  CourseNav,
  Lesson,
  Rail,
  RailDivider,
  RailItem,
  RailSpacer,
} from "@tech-prep/ui";
import type { LessonStatus } from "@tech-prep/ui";
import { RotateCcw, Search, Settings } from "lucide-react";

/** The icon rail as the course screens show it. */
export const SampleRail = () => (
  <Rail>
    <RailItem label="Search">
      <Search size={16} />
    </RailItem>
    <RailItem count={4} label="Daily review">
      <RotateCcw size={16} />
    </RailItem>
    <RailDivider />
    <RailItem active label="TypeScript">
      <Badge active initials="TS" />
    </RailItem>
    <RailItem label="jq">
      <Badge initials="jq" />
    </RailItem>
    <RailItem label="Blind 75">
      <Badge initials="75" />
    </RailItem>
    <RailSpacer />
    <RailItem label="Settings">
      <Settings size={16} />
    </RailItem>
  </Rail>
);

const LESSONS: [string, string][] = [
  ["What a Set is", "Read"],
  ["Uniqueness rule", "Predict"],
  ["Insertion order", "Arrange"],
  ["Write uniqueBy", "Code"],
  ["size, not length", "Predict"],
];

/** The TypeScript course with the Sets chapter open at lesson `current` (0-based). */
export const SampleNav = ({ current }: { current: number }) => {
  const status = (i: number): LessonStatus => (i < current ? "done" : "todo");

  return (
    <CourseNav
      header={
        <CourseHeader
          meta="14 of 37 lessons · 2 due today"
          progress={14 / 37}
          title="TypeScript"
        />
      }
    >
      <Chapter done label="1  Values and types" />
      <Chapter done label="2  Functions and closures" />
      <Chapter current meta={`${current} / 5`} open label="3  Sets">
        {LESSONS.map(([label, kind], i) => (
          <Lesson
            current={i === current}
            key={label}
            label={label}
            meta={kind}
            selected={i === current}
            status={status(i)}
          />
        ))}
      </Chapter>
      <Chapter label="4  Maps" meta="0 / 6" />
      <Chapter label="5  Generics" meta="0 / 8" />
      <Chapter label="6  Promises and async" meta="0 / 7" />
    </CourseNav>
  );
};
