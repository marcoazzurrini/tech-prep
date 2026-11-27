# Collect Team Skills (medium)

Write `collectTeamSkills(teams)`. Each team is `{ active, members }`.

Ignore teams where `active` is falsy. Each member is `{ name, skills }`, where `skills` may be an array of strings, `null` or `undefined`.

Return a single array of all skills from all members of active teams, in order.

Example 1:
  collectTeamSkills([{ active: true, members: [{ name: "Ada", skills: ["js", "sql"] }, { name: "Bo", skills: null }] }])  ->  ["js", "sql"]
Example 2:
  collectTeamSkills([{ active: false, members: [{ name: "Cy", skills: ["go"] }] }])  ->  []
Example 3:
  collectTeamSkills([])  ->  []
