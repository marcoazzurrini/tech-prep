# Trim and Peek (easy)

Write `trimAndPeek(items, maxLength)`. If `items` has more than `maxLength` elements, shorten `items` in place so it keeps only the first `maxLength` elements.

Return the last element of `items` after trimming, or `null` if `items` is empty.

Example 1: trimAndPeek([1, 2, 3, 4], 2)  ->  2 (array becomes [1, 2])
Example 2: trimAndPeek(["x", "y"], 5)  ->  "y" (array stays ["x", "y"])
Example 3: trimAndPeek([10, 20], 0)  ->  null (array becomes [])
