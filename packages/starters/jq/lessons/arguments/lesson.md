# Pass Values into a Filter

## A value with a name

**Input**

```json
[{"name": "ada", "team": "ops"}, {"name": "bo", "team": "web"}, {"name": "cy", "team": "ops"}]
```

**Command**

```sh
jq --arg team ops '.[] | select(.team == $team)' data.json
```

**Output**

```json
{"name": "ada", "team": "ops"}
{"name": "cy", "team": "ops"}
```

**Rule:** `--arg name value` hands a value to the filter. In the filter, the **variable** `$name` stands for that value.

`--arg team web` gives the users of the team `web`. The filter stays the same.

`$team` has no quotes around it. `"$team"` in quotes is only a string made of those five characters.

<!-- task -->

## --arg always gives text

**Input**

```json
[{"repo": "api", "stars": 12}, {"repo": "web", "stars": 3}, {"repo": "cli", "stars": 40}]
```

**Command**

```sh
jq --argjson max 10 '.[] | select(.stars < $max) | .repo' data.json
```

**Output**

```json
"web"
```

**Rule:** `--arg` always makes a string. `--argjson` reads the value as JSON, so `10` is a number.

`--arg` is for text. `--argjson` is for a number, for `true` or `false`, and for any other JSON value.

**Common mistake:** `--arg` for a number. There is no error, only a wrong output.

**Wrong**

```sh
jq «--arg» max 10 '.[] | select(.stars < $max) | .repo' data.json
```

**Output**

```json
"api"
"web"
"cli"
```

**Fix**

```sh
jq «--argjson» max 10 '.[] | select(.stars < $max) | .repo' data.json
```

With `--arg`, `$max` is the string `"10"`. jq counts every number as smaller than every string. So `<` is true for every repo, and `>` or `>=` prints nothing.

<!-- task -->

## Build JSON with no input

**Command**

```sh
jq -n --arg name Ada --argjson age 36 '{name: $name, age: $age}'
```

**Output**

```json
{"name": "Ada", "age": 36}
```

**Rule:** `-n` tells jq to read no input. The filter runs once, and the command names no file.

`$name` is the string `"Ada"` and `$age` is the number `36`. jq writes the quotes, so the output is always correct JSON.

`-n` is needed here. Without it, jq waits for an input and prints nothing.

<!-- task -->

## Remember

- `--arg name value` hands a value to the filter. In the filter you write `$name`, with no quotes.
- A value from `--arg` is always a string. A number test with it goes wrong, with no error.
- `--argjson name value` reads the value as JSON. Use it for numbers, `true` and `false`.
- `-n` runs the filter with no input. With `{key: $name}` it builds new JSON from your values.
