import {
  Button,
  LessonText,
  List,
  ListRow,
  Page,
  PageLabel,
  SessionActions,
  SessionBar,
  SessionBody,
  SessionPane,
} from "@tech-prep/ui";
import { Fragment, useState } from "react";

import { engine, inDays } from "./course";
import type { Course, Lesson } from "./types";

type Row = Course["topics"][number]["lessons"][number];

/** Where a concept stands, in a few words. */
const standing = (row: Row): string => {
  if (!row.written) {
    return "Not written yet";
  }

  if (row.status === "done") {
    return row.next_review
      ? `Learned · review ${inDays(row.next_review)}`
      : "Learned";
  }

  if (row.status === "locked") {
    return "Locked";
  }

  return row.status === "todo" ? "To learn" : "Learning";
};

/** A lesson's parts as one text, each under its own heading. */
const wholeText = (lesson: Lesson): string =>
  lesson.parts
    .map((p) =>
      p.title === lesson.name ? p.text : `## ${p.title}\n\n${p.text}`
    )
    .join("\n\n");

interface ConceptsScreenProps {
  course: Course;
  /** Back to Today. */
  onBack: () => void;
}

/**
 * Every concept of the course with where it stands. A learned concept can be read again.
 * The others come in a session, so they are only listed.
 */
export const ConceptsScreen = ({ course, onBack }: ConceptsScreenProps) => {
  const [reading, setReading] = useState<Lesson | null>(null);
  const { concepts } = course;

  /** Show a learned concept's lesson. Nothing starts: it is only read. */
  const read = async (id: string) => {
    setReading(await engine("lesson.open", { concept: id }));
  };

  if (reading) {
    return (
      <SessionPane>
        <SessionBar />
        <SessionBody
          footer={
            <SessionActions>
              <Button variant="primary" onClick={() => setReading(null)}>
                Back to concepts
              </Button>
            </SessionActions>
          }
        >
          <LessonText text={wholeText(reading)} title={reading.name} />
        </SessionBody>
      </SessionPane>
    );
  }

  return (
    <SessionPane>
      <SessionBar
        actions={
          <Button variant="ghost" onClick={onBack}>
            Back to today
          </Button>
        }
      />
      <Page
        lead={`${concepts.learned} of ${concepts.total} learned. A session teaches them in order.`}
        title={`${course.subject.name} concepts`}
      >
        {course.topics.map((topic) => (
          <Fragment key={topic.id}>
            <PageLabel>{topic.name}</PageLabel>
            <List>
              {topic.lessons.map((row) => (
                <ListRow
                  end={
                    row.status === "done" && row.written ? (
                      <Button
                        onClick={() => {
                          void read(row.id);
                        }}
                      >
                        Read
                      </Button>
                    ) : undefined
                  }
                  detail={standing(row)}
                  key={row.id}
                  title={row.name}
                />
              ))}
            </List>
          </Fragment>
        ))}
      </Page>
    </SessionPane>
  );
};
