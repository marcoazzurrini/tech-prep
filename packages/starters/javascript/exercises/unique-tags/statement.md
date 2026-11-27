# Unique Tags (medium)

Write `uniqueTags(tags)`. It takes an array of tags and returns a new array with no repeats, in English dictionary order.

Two tags are repeats when they differ only in case or accents, such as `"Café"` and `"cafe"`. Keep the spelling that comes first in the input.

Example 1: uniqueTags(["JS", "café", "js", "Cafe", "api"])  ->  ["api", "café", "JS"]
Example 2: uniqueTags(["Node", "node", "NODE"])  ->  ["Node"]
Example 3: uniqueTags([])  ->  []
