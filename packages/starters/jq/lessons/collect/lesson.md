# Collect Results into a List

`.[] | .name` gives several outputs, one after another. Often you want them together, as one array. Then you can count them, or hand them to a program that expects one JSON value.

## Square brackets collect outputs

Put square brackets around a filter. jq runs the filter and puts all its outputs into one array:

**Input**

```json
[
  {"name": "Ada", "city": "Oslo"},
  {"name": "Bo", "city": "Bergen"}
]
```

**Filter**

```jq
[.[] | .name]
```

**Output**

```json
["Ada", "Bo"]
```

Read it as "an array of every name".

Compare the two forms:

- `.[] | .name` gives two outputs: `"Ada"`, then `"Bo"`.
- `[.[] | .name]` gives one output: the array `["Ada", "Bo"]`.

These are the same brackets that JSON uses to write an array. In a filter, you write the brackets and the filter inside makes the items.

To collect is to gather several things into one. The outputs keep their order.

<!-- task -->

## Where the brackets go

The brackets collect the outputs of what is **inside** them. So the step that takes the array apart must be inside.

A common mistake is to put the brackets around the last step only:

```jq
.[] | [.name]
```

```json
["Ada"]
["Bo"]
```

This gives two small arrays, not one. Here is why. `.[]` takes the array apart first. Then `[.name]` runs once for each item, and each time it makes an array with one name.

To fix it, move the opening bracket to the start: `[.[] | .name]`.

The same holds for an array inside an object. The brackets go around the whole chain:

```jq
[.members[] | .name]
```

<!-- task -->

## Lists inside lists

An item can hold a list of its own:

**Input**

```json
[
  {"title": "Intro", "tags": ["jq", "json"]},
  {"title": "Pipes", "tags": ["jq"]}
]
```

**Filter**

```jq
.[] | .tags[]
```

**Output**

```json
"jq"
"json"
"jq"
```

- `.[]` gives each post.
- `.tags[]` runs once for each post. It takes that post's tags apart.

So the second step gives several outputs too. Brackets collect all of them into one flat array:

```jq
[.[] | .tags[]]
```

```json
["jq", "json", "jq"]
```

After the closing bracket you have one array again. You can pipe it on: `[.[] | .tags[]] | length` gives `3`.

<!-- task -->

## Remember

- `[filter]` collects all the outputs of the filter into one array.
- `[.[] | .name]` is "an array of every name".
- The step that takes the array apart must be inside the brackets.
- `.[] | [.name]` is the mistake: it makes one small array for each item.
- After the closing bracket you have one value again, and you can pipe it on.
