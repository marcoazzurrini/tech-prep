# Pair Keys with Values (medium)

Write `zipToMap(keys, values)`. Each argument is anything a `for...of` loop accepts: an array, a string, a `Set`, the keys of a `Map`, and so on.

It returns a `Map` that pairs the first key with the first value, the second key with the second value, and so on. It stops as soon as either side runs out. A key that comes twice keeps its last value.

Example 1: zipToMap(["a", "b"], [1, 2])  ->  Map { "a" => 1, "b" => 2 }
Example 2: zipToMap("xyz", new Set([7, 8]))  ->  Map { "x" => 7, "y" => 8 }
Example 3: zipToMap([], [1])  ->  an empty Map
