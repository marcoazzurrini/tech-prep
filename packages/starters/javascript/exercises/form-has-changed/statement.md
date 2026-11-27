# Unsaved Changes (medium)

A settings form keeps the values it last saved. The Save button turns on only when the user's draft differs from them. Write `hasChanged(saved, draft)`. It returns `true` when the draft differs anywhere, at any depth, and `false` when it holds the same data.

The values hold strings, numbers, booleans, `null`, `undefined`, arrays and plain objects.

- The order of keys does not matter. The order of array items does.
- A `NaN` in both places is no change.
- A key that holds `undefined` is not the same as a missing key.
- An array is never the same as an object that is not an array.

Example 1: hasChanged({ theme: "dark", tabs: [1, 2] }, { tabs: [1, 2], theme: "dark" })  ->  false
Example 2: hasChanged({ font: { size: 12 } }, { font: { size: 14 } })  ->  true
Example 3: hasChanged({ zoom: NaN }, { zoom: NaN })  ->  false
