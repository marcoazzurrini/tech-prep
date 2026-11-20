# Replace Text

## Replace the first match

**Input**

```json
{"branch": "feature/login", "author": "ada"}
```

**Filter**

```jq
.branch | sub("feature"; "feat")
```

**Output**

```json
"feat/login"
```

```steps
.branch => "feature/login"
.branch «| sub("feature"; "feat")» => "feat/login"
```

**Rule:** `sub("old"; "new")` finds the first `old` in a string and puts `new` in its place.

`.branch | sub("feature/"; "")` gives `"login"`. An empty string removes the text.

**Common mistake:** A comma between the two texts.

**Wrong**

```jq
.branch | sub("feature"«,» "feat")
```

**Error**

```text
jq: error: sub/1 is not defined at <top-level>, line 1:
```

**Fix**

```jq
.branch | sub("feature"«;» "feat")
```

`sub/1` means "`sub` with one text". Only a **semicolon** separates the two texts.

<!-- task -->

## Replace every match

**Input**

```json
{"title": "Fix login bug", "version": "1.2.3"}
```

**Filter**

```jq
.title | sub(" "; "-")
```

**Output**

```json
"Fix-login bug"
```

**Filter**

```jq
.title | gsub(" "; "-")
```

**Output**

```json
"Fix-login-bug"
```

**Rule:** `gsub("old"; "new")` replaces every match. `sub` stops after the first.

**Common mistake:** A dot in the first text.

**Wrong**

```jq
.version | gsub(«"."»; "-")
```

**Output**

```json
"-----"
```

**Fix**

```jq
.version | «split(".") | join("-")»
```

The first text is a **pattern**. In it a dot stands for "any character". Other marks with a special meaning are `*`, `+`, `?`, `(`, `[`, `^` and `$`. Letters, digits, spaces, `-` and `_` stand for themselves.

<!-- task -->

## Change the case

**Input**

```json
{"name": "Ada Lovelace"}
```

**Filter**

```jq
.name | ascii_downcase
```

**Output**

```json
"ada lovelace"
```

**Filter**

```jq
.name | ascii_downcase | gsub(" "; "-")
```

**Output**

```json
"ada-lovelace"
```

```steps
.name => "Ada Lovelace"
.name «| ascii_downcase» => "ada lovelace"
.name | ascii_downcase «| gsub(" "; "-")» => "ada-lovelace"
```

**Rule:** `ascii_downcase` makes every letter a small letter. `ascii_upcase` makes every letter a capital letter.

`.name | ascii_upcase` gives `"ADA LOVELACE"`. Both take a string and give a string, with nothing in parentheses.

`"É" | ascii_downcase` gives `"É"`. Only the plain letters `a` to `z` change.

<!-- task -->

## Remember

- `sub("old"; "new")` replaces the first match. `gsub("old"; "new")` replaces every match.
- The two texts are separated by a semicolon, not a comma. Replace with `""` to remove text.
- The first text is a pattern. For dots and other special marks, use `split` and `join`.
- `ascii_downcase` and `ascii_upcase` change the case of the letters.
