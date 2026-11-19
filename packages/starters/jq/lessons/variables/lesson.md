# Name a Value

After a pipe, `.` is the value the step before gave. The outer input is then out of reach. Sometimes you still need a value from it. A **variable** keeps that value for you.

## A value you can no longer reach

You want every member, together with the name of the team.

**Input**

```json
{"team": "core", "members": [{"name": "Ada"}, {"name": "Bo"}]}
```

**Filter**

```jq
.members[] | {name, team: .team}
```

**Output**

```json
{"name": "Ada", "team": null}
{"name": "Bo", "team": null}
```

The team is `null`. After `.members[]`, the dot is one member. A member has no `team` key. The team name sits in the outer object, and the dot cannot go back to it.

The fix: take the team name **before** you go inside, and give it a name.

```jq
.team as $team | .members[] | {name, team: $team}
```

```json
{"name": "Ada", "team": "core"}
{"name": "Bo", "team": "core"}
```

- `.team as $team` takes the team name and stores it under the name `$team`. This is a **variable**: a name for a value. The name always starts with `$`.
- Later, `$team` gives that value back. It does not matter what the dot is by then.

Read `.team as $team` as "take `team` and call it `$team`".

<!-- task -->

## `as` does not move the dot

Most steps change the dot. `as` does not. After `.team as $team |`, the dot is still the whole input. That is why you can go on with `.members`.

So `as` adds a name and changes nothing else. The name works from there to the end of the filter, also inside `map`:

**Input**

```json
{"team": "core", "members": [{"name": "Ada"}, {"name": "Bo"}]}
```

**Filter**

```jq
.team as $team | .members | map({name, team: $team})
```

**Output**

```json
[{"name": "Ada", "team": "core"}, {"name": "Bo", "team": "core"}]
```

You choose the name yourself. Spell it the same way each time. If you use a name you never made, jq stops with an error:

```text
jq: error: $tem is not defined
```

Read it as "there is no variable called `$tem`". Check the spelling, and check that the `as` comes before the place where you use the name.

<!-- task -->

## A name for each item

`as` can also come in the middle of a chain. Put it after `.[]`, and it runs once for each item. Each time, the variable holds the value of that item.

Here every user has a list of languages. You want one output for each language, with the user's name next to it.

**Input**

```json
[
  {"name": "Ada", "langs": ["ts", "go"]},
  {"name": "Bo", "langs": ["py"]}
]
```

**Filter**

```jq
.[] | .name as $name | .langs[] | {name: $name, lang: .}
```

**Output**

```json
{"name": "Ada", "lang": "ts"}
{"name": "Ada", "lang": "go"}
{"name": "Bo", "lang": "py"}
```

- `.[]` gives each user.
- `.name as $name` keeps the name of this user. The dot is still the user.
- `.langs[]` goes inside. Now the dot is one language, a string.
- `{name: $name, lang: .}` uses the kept name and the language.

<!-- task -->

## Remember

- After a pipe, the dot is the inner value. The outer value is out of reach.
- `value as $name | ...` stores a value under a name. The name starts with `$`.
- `as` does not change the dot. It only adds a name.
- The name works from the `as` to the end of the filter, also inside `map`.
- After `.[]`, `as` runs once for each item and holds that item's value.
