# Copy a Scene Tree (hard)

A game keeps its scene as a tree of sprites, made with the class `Sprite`. Each sprite has a `name`, an array of `children` and a `parent`, which is the sprite above it or `null`. Some sprites also carry extra data under a symbol key.

Write `copyTree(root)`. It returns a new tree that shares no sprite, array or data object with the old one.

- Each copied sprite is still a `Sprite`, so its methods work.
- Each `parent` in the new tree points to a sprite of the new tree.
- Symbol keys are copied, with their data.

Example 1:
  const root = new Sprite("world");
  const tree = new Sprite("tree");
  root.add(tree);
  const copy = copyTree(root);
  copy.children[0].parent === copy  ->  true
  copy.children[0].path()  ->  "world/tree"

Note: the file exports `Sprite` for the tests. Keep it as it is.
