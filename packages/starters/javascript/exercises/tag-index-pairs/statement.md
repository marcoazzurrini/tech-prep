# Tag Index (medium)

A `TagIndex` files items under tags. `add(tag, item)` files one item. One tag can hold many items.

Make a `TagIndex` work with `for...of`, spread and `new Map`. It gives one `[tag, item]` pair per item. The tags come in the order they were first added, and each tag's items come in the order they were added.

Example 1:
  const t = new TagIndex();
  t.add("js", "a"); t.add("css", "b"); t.add("js", "c");
  [...t]  ->  [["js", "a"], ["js", "c"], ["css", "b"]]
Example 2: [...new TagIndex()]  ->  []
