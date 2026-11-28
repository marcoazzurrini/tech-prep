import { Badge, Rail, RailItem } from "@tech-prep/ui";

/** The icon rail as the app shows it: one badge per course, with its reviews due. */
export const SampleRail = () => (
  <Rail>
    <RailItem label="Blind 75">
      <Badge initials="DSA" />
    </RailItem>
    <RailItem label="TypeScript">
      <Badge initials="TS" />
    </RailItem>
    <RailItem active count={3} label="jq">
      <Badge active initials="jq" />
    </RailItem>
  </Rail>
);
