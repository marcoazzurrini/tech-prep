# Chain Steps with a Pipe

So far a filter was one path. Real tasks need several steps. The pipe joins steps into a chain.

## The output of one step is the input of the next

Write `|` between two filters:

**Input**

```json
{"user": {"name": "Ada", "langs": ["ts", "go"]}}
```

**Filter**

```jq
.user | .langs
```

**Output**

```json
["ts", "go"]
```

- `.user` runs first. It gives the inner object.
- The pipe hands that object to the next filter.
- `.langs` runs on the inner object, not on the original input.

After a pipe, the dot means "what the step before gave me". It no longer means the original input.

For paths, the pipe and the dot do the same job: `.user | .langs` equals `.user.langs`. The pipe becomes important in the next part.

<!-- task -->

## Filters with names

Not every filter starts with a dot. jq has many ready-made filters with names. Here are two:

- `length` gives the size of its input: the number of items in an array, of keys in an object, or of characters in a string.
- `keys` gives the keys of an object, as an array in alphabetical order.

A named filter works on its input, like every filter. So you use a pipe to hand it the right value:

**Input**

```json
{"user": "ada", "repos": ["api", "web", "docs"]}
```

**Filter**

```jq
.repos | length
```

**Output**

```json
3
```

`.repos` takes the array. Then `length` counts its items.

<!-- task -->

## Build a chain step by step

Write one step, read the output, then add the next step. Each step should bring the value closer to what you want.

Say you want to know how many keys the first server has:

- `.servers` gives the array of servers.
- `.servers | .[0]` gives the first server.
- `.servers | .[0] | keys` gives its keys.
- `.servers | .[0] | keys | length` gives the number of keys.

You could shorten it to `.servers[0] | keys | length`. Both are right. Short steps are easier to check.

<!-- task -->

## Remember

- `a | b` runs `a`, then runs `b` on what `a` gave.
- After a pipe, `.` is the output of the step before.
- `length` counts items, keys or characters. `keys` lists the keys of an object.
- Build a chain one step at a time, and read the output after each step.
