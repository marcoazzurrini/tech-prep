# Collect Results into a List

## Square brackets collect outputs

**Input**

```json
[{"name": "Ada", "city": "Oslo"}, {"name": "Bo", "city": "Bergen"}]
```

**Filter**

```jq
[.[] | .name]
```

**Output**

```json
["Ada", "Bo"]
```

```steps
.[] => {"name": "Ada", "city": "Oslo"} ;; {"name": "Bo", "city": "Bergen"}
.[] «| .name» => "Ada" ;; "Bo"
«[.[] | .name]» => ["Ada", "Bo"]
```

**Rule:** `[filter]` runs the filter and puts all its outputs into one array, in the same order.

`[.[] | .name]` reads as "an array of every name". These are the brackets JSON uses to write an array.

<!-- task -->

## Where the brackets go

**Input**

```json
{"team": "core", "members": [{"name": "Ada"}, {"name": "Bo"}]}
```

**Filter**

```jq
[.members[] | .name]
```

**Output**

```json
["Ada", "Bo"]
```

**Rule:** The brackets collect what is inside them. The step that takes the array apart must be inside.

**Common mistake:** Brackets around the last step only.

**Wrong**

```jq
.members[] | «[.name]»
```

**Output**

```json
["Ada"]
["Bo"]
```

**Fix**

```jq
«[».members[] | .name]
```

`[.name]` runs once for each member. Each time it makes a small array with one name.

<!-- task -->

## Lists inside lists

**Input**

```json
[{"title": "Intro", "tags": ["jq", "json"]}, {"title": "Pipes", "tags": ["jq"]}]
```

**Filter**

```jq
[.[] | .tags[]]
```

**Output**

```json
["jq", "json", "jq"]
```

```steps
.[] => {"title": "Intro", "tags": ["jq", "json"]} ;; {"title": "Pipes", "tags": ["jq"]}
.[] «| .tags[]» => "jq" ;; "json" ;; "jq"
«[.[] | .tags[]]» => ["jq", "json", "jq"]
```

**Rule:** A step can give several outputs for each item. The brackets collect all of them into one flat array.

`[.[] | .tags[]] | length` gives `3`. After the closing bracket you have one array again, and you can pipe it on.

<!-- task -->

## Remember

- `[filter]` collects all the outputs of the filter into one array.
- The step that takes the array apart must be inside the brackets: `[.[] | .name]`.
- `.[] | [.name]` is the mistake: it makes one small array for each item.
- After the closing bracket you have one value again, and you can pipe it on.
