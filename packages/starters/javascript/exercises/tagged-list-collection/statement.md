# Tagged List (medium)

Write `class TaggedList` that behaves like an `Array` and carries a string `tag` property.

`new TaggedList(tag, ...items)` sets `this.tag = tag` and stores all `items` as its elements (including when a single number is passed as the only item).

Add `describe()` returning `"<tag> (<length>)"`. Calling `map`, `filter`, or `slice` on a `TaggedList` must return a plain `Array` (not a `TaggedList`).

Example 1:
  const list = new TaggedList("scores", 10, 20);
  list.describe()  ->  "scores (2)"
  list[0]  ->  10

Example 2:
  const doubled = new TaggedList("nums", 5).map((n) => n * 2);
  doubled instanceof TaggedList  ->  false
  doubled  ->  [10]
