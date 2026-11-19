# Replace Text

Data often comes with text that is almost right. A branch name has the wrong prefix. A title has spaces where you need dashes. An email has capital letters. You want the same string with a small change.

## Replace the first match

`sub` finds a piece of text in a string and puts other text in its place:

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

`sub` takes two texts, with a **semicolon** between them. The first is the text to find. The second is the text to put there. Read it as "replace `feature` with `feat`".

To remove text, replace it with an empty string: `sub("feature/"; "")` gives `"login"`.

A common mistake is to write a comma in place of the semicolon. Then jq stops:

```text
jq: error: sub/1 is not defined at <top-level>, line 1:
```

`sub/1` means "`sub` with one text". jq did not see two texts, because a comma does not separate them. Write a semicolon.

<!-- task -->

## Replace every match

`sub` stops after the first match. `gsub` goes on and replaces every match. It is written the same way:

**Input**

```json
{"title": "Fix login bug"}
```

- `.title | sub(" "; "-")` gives `"Fix-login bug"`. Only the first space changed.
- `.title | gsub(" "; "-")` gives `"Fix-login-bug"`.

There is a trap. The first text is not plain text. It is a **pattern**, in which some marks have a special meaning. Letters, digits, spaces, `-` and `_` stand for themselves. But a dot stands for "any character":

**Input**

```json
"1.2.3"
```

**Filter**

```jq
gsub("."; "-")
```

**Output**

```json
"-----"
```

Every character was replaced, not only the dots. Other marks with a special meaning are `*`, `+`, `?`, `(`, `[`, `^` and `$`.

For those, use what you know: split, then join. `split(".") | join("-")` gives `"1-2-3"`.

<!-- task -->

## Change the case

Two strings that differ only in capital letters are different strings for jq. `"Ada@Example.com"` is not `"ada@example.com"`. To compare or tidy such text, bring it all to one case first.

- `ascii_downcase` makes every letter a small letter.
- `ascii_upcase` makes every letter a capital letter.

They take no text in parentheses. They change their input:

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

Each of these filters takes a string and gives a string. So you can chain them with pipes:

- `.name | ascii_downcase | gsub(" "; "-")` gives `"ada-lovelace"`.

The word `ascii` says which letters change: the plain letters `a` to `z`. A letter with an accent, such as `É`, stays as it is.

<!-- task -->

## Remember

- `sub("old"; "new")` replaces the first match. `gsub("old"; "new")` replaces every match.
- The two texts are separated by a semicolon, not a comma.
- Replace with `""` to remove text.
- The first text is a pattern. A dot means "any character". For dots and other special marks, use `split` and `join`.
- `ascii_downcase` and `ascii_upcase` change the case of the letters.
