Write a class `Tag`.

- `static prefix = "TAG"`
- `new Tag(name)` sets `this.name = name`.
- `static fromText(text)` returns a new `Tag` with `text.trim()`, created with `new this(...)`.
- `label()` returns `"<prefix>:<name>"`, reading the static `prefix` from the class.

Example 1:
  const tag = Tag.fromText("  news  ");
  tag.name  ->  "news"
  tag.label()  ->  "TAG:news"
