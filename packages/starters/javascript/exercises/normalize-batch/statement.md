# Normalize Batch (medium)

Write `normalizeBatch(input, fallback)`.

Convert `input` into a real array. Replace every missing, `null`, or `undefined` slot with `fallback`. Keep other values such as `0`, `false`, and `""`.

Return `[]` when `input` has no positive `length`.

Example 1: normalizeBatch({ 0: "a", 2: "c", length: 3 }, "-")  ->  ["a", "-", "c"]
Example 2: normalizeBatch([0, null, false, undefined], "x")  ->  [0, "x", false, "x"]
Example 3: normalizeBatch({ a: 1 }, "x")  ->  []
