# Name a Value

## A value you can no longer reach

**Input**

```json
{"team": "core", "members": [{"name": "Ada"}, {"name": "Bo"}]}
```

**Filter**

```jq
.team as $team | .members[] | {name, team: $team}
```

**Output**

```json
{"name": "Ada", "team": "core"}
{"name": "Bo", "team": "core"}
```

```steps
.team as $team | .members[] => {"name": "Ada"} ;; {"name": "Bo"}
.team as $team | .members[] «| {name, team: $team}» => {"name": "Ada", "team": "core"} ;; {"name": "Bo", "team": "core"}
```

**Rule:** `.team as $team` takes `team` and stores it under the name `$team`. Later, `$team` gives that value back, whatever the dot is by then.

`$team` is a **variable**: a name for a value. The name always starts with `$`.

**Common mistake:** A path to a value that the dot can no longer reach.

**Wrong**

```jq
.members[] | {name, team: «.team»}
```

**Output**

```json
{"name": "Ada", "team": null}
{"name": "Bo", "team": null}
```

**Fix**

```jq
«.team as $team | ».members[] | {name, team: $team}
```

After `.members[]`, the dot is one member. A member has no `team`. Take the team name before you go inside.

<!-- task -->

## `as` does not move the dot

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

```steps
.team as $team | . => {"team": "core", "members": [{"name": "Ada"}, {"name": "Bo"}]}
.team as $team | .members => [{"name": "Ada"}, {"name": "Bo"}]
.team as $team | .members «| map({name, team: $team})» => [{"name": "Ada", "team": "core"}, {"name": "Bo", "team": "core"}]
```

**Rule:** `as` adds a name and changes nothing else. After it, the dot is still the whole input.

`$team` works from the `as` to the end of the filter, also inside `map`.

`.team as $a | .members as $b | [$a, $b]` gives `["core", [{"name": "Ada"}, {"name": "Bo"}]]`. Two `as` steps in a row make two names.

**Common mistake:** A name you never made.

**Wrong**

```jq
.team as $team | .members | map({name, team: «$tem»})
```

**Error**

```text
jq: error: $tem is not defined at <top-level>, line 1:
```

**Fix**

```jq
.team as $team | .members | map({name, team: «$team»})
```

It means there is no variable called `$tem`. Check the spelling. Check that the `as` comes before the place where you use the name.

<!-- task -->

## A name for each item

**Input**

```json
[{"name": "Ada", "langs": ["ts", "go"]}, {"name": "Bo", "langs": ["py"]}]
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

```steps
.[] => {"name": "Ada", "langs": ["ts", "go"]} ;; {"name": "Bo", "langs": ["py"]}
.[] «| .name as $name | .langs[]» => "ts" ;; "go" ;; "py"
.[] | .name as $name | .langs[] «| {name: $name, lang: .}» => {"name": "Ada", "lang": "ts"} ;; {"name": "Ada", "lang": "go"} ;; {"name": "Bo", "lang": "py"}
```

**Rule:** After `.[]`, `as` runs once for each item. Each time, the variable holds the value of that item.

`.name as $name` keeps the name of this user. Then `.langs[]` goes inside, and the dot is one language, a string.

`map(.name as $name | .langs | map({name: $name, lang: .}))` does the same job inside `map`. It gives one inner array for each user.

<!-- task -->

## Remember

- After a pipe, the dot is the inner value. The outer value is out of reach.
- `value as $name | ...` stores a value under a name. The name starts with `$`.
- `as` does not change the dot. The name works from the `as` to the end of the filter, also inside `map`.
- After `.[]`, `as` runs once for each item and holds that item's value.
