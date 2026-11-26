# Team Badges (easy)

`createTeam(name)` returns a team: an object with a `name`, a list of `members` and two methods.

- `join(person)` adds a person to `members`.
- `badges()` returns one badge for each member: the person, then the team's name in brackets.

Both methods are broken. Fix them.

Example 1:
  const team = createTeam("Blue");
  team.join("Ana");
  team.join("Leo");
  team.badges()  ->  ["Ana (Blue)", "Leo (Blue)"]
