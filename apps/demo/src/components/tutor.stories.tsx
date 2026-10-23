import type { Meta, StoryObj } from "@storybook/react-vite";
import { Activity, Composer, Message, TutorPane } from "@tech-prep/ui";
import { useState } from "react";
import { fn } from "storybook/test";

const Tutor = ({ busy }: { busy: boolean }) => {
  const [draft, setDraft] = useState("");

  return (
    <div style={{ height: 640, width: 380 }}>
      <TutorPane
        composer={
          <Composer
            value={draft}
            onChange={setDraft}
            onSend={() => setDraft("")}
          />
        }
        context="Contains Duplicate"
        onClose={fn()}
      >
        <Message from="tutor">
          <p>
            Before any code: what would you need to <strong>remember</strong> as
            you walk the array?
          </p>
        </Message>
        <Message from="learner">The numbers I have already seen?</Message>
        <Message from="tutor">
          <p>
            Yes. Which structure answers “have I seen this?” in constant time?
          </p>
        </Message>
        <Message from="error">
          The tutor stopped. Send a message to start it again.
        </Message>
        {busy && <Activity>Running the tests</Activity>}
      </TutorPane>
    </div>
  );
};

const meta = {
  args: { busy: true },
  component: Tutor,
  title: "Components/Tutor",
} satisfies Meta<typeof Tutor>;

export default meta;

export const Thread: StoryObj<typeof meta> = {};
