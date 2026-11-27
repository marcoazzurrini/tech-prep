`ratingLabel(ratings)` returns the average rating as text, or `"not rated"` for an empty list.

The code below also returns `"not rated"` when `ratings` is not a list at all. That hides a bug in the caller.

Fix `ratingLabel`. It should return `"not rated"` only for the error with the message `"no ratings"`. Every other error must reach the caller.

Example 1: ratingLabel([{ stars: 4 }, { stars: 5 }])  ->  "4.5"
Example 2: ratingLabel([])  ->  "not rated"
Example 3: ratingLabel(null)  ->  throws a TypeError
