# Pass Values into a Filter

Today you want the users of the team `ops`. Tomorrow you want the team `web`. You do not want to rewrite the filter each time. You want one command, and a value that you hand to it from outside.

## A value with a name

The flag `--arg` hands a value to the filter. Two words follow it: a name, then a value.

Here is `users.json`:

```json
[{"name": "ada", "team": "ops"}, {"name": "bo", "team": "web"}, {"name": "cy", "team": "ops"}]
```

```sh
jq --arg team ops '.[] | select(.team == $team)' users.json
```

```json
{
  "name": "ada",
  "team": "ops"
}
{
  "name": "cy",
  "team": "ops"
}
```

- `--arg team ops` says: the name is `team`, the value is `ops`.
- In the filter, `$team` stands for that value. A name with `$` in front is called a **variable**.

Read `$team` as "the value named team". So the test compares `.team` with `"ops"`.

For another team, change one word: `--arg team web`. The filter stays the same.

Write `$team` with no quotes around it. `"$team"` in quotes is only a string made of those five characters.

<!-- task -->

## --arg always gives text

Here is `stars.json`:

```json
[{"repo": "api", "stars": 12}, {"repo": "web", "stars": 3}, {"repo": "cli", "stars": 40}]
```

You want the repos with 10 stars or more:

```sh
jq --arg min 10 '.[] | select(.stars >= $min) | .repo' stars.json
```

It prints nothing. There is no error either.

The reason: a terminal hands every word to jq as text. jq cannot know if you meant the number `10` or the text `10`. So `--arg` always makes a string. `$min` is `"10"`, in quotes. A number and a string are never equal, and jq counts every number as smaller than every string. So the test is false for every repo.

The flag `--argjson` reads the value as JSON. Then `10` is a number:

```sh
jq --argjson min 10 '.[] | select(.stars >= $min) | .repo' stars.json
```

```json
"api"
"cli"
```

Use `--arg` for text. Use `--argjson` for a number, for `true` or `false`, and for any other JSON value.

<!-- task -->

## Build JSON with no input

Sometimes you have no JSON yet. You want to make some, for example a small object to send to a web service. You have the values in the terminal.

Two new things do this.

The flag `-n` tells jq to read no input. The filter runs once, with nothing going in.

Curly braces build an object. Inside go a key, a colon and a value. A comma separates the pairs. The keys need no quotes.

```sh
jq -n --arg name Ada --argjson age 36 '{name: $name, age: $age}'
```

```json
{
  "name": "Ada",
  "age": 36
}
```

- `-n` means: do not wait for input.
- `--arg name Ada` makes `$name` the string `"Ada"`.
- `--argjson age 36` makes `$age` the number `36`.
- `{name: $name, age: $age}` builds an object with two keys.

jq writes the quotes for you. The result is always correct JSON, even when the text has quotes or other special characters in it.

<!-- task -->

## Remember

- `--arg name value` hands a value to the filter. In the filter you write `$name`.
- Write `$name` with no quotes around it.
- A value from `--arg` is always a string. A number test with it finds nothing.
- `--argjson name value` reads the value as JSON. Use it for numbers, `true` and `false`.
- `-n` runs the filter with no input. With `{key: $name}` it builds new JSON from your values.
