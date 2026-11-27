# Apply a Patch (medium)

Write `applyPatch(list, patch)`. It returns a new array: a copy of `list` with some items replaced.

`patch` is an array that has an item only at the indexes to replace. Where `patch` has an index, the new array takes the patch's item, even when that item is `undefined`. Where `patch` has no index at all, the new array keeps the item from `list`.

Do not change `list` or `patch`.

Example 1: applyPatch([1, 2, 3], [, 20])  ->  [1, 20, 3]
Example 2: applyPatch(["a", "b"], [undefined])  ->  [undefined, "b"]
Example 3: applyPatch([5, 6], [])  ->  [5, 6]

Constraints: `patch` is never longer than `list`.
