# Flatten a Task List (medium)

A to-do app keeps its tasks in nested lists: a list can hold tasks and lists of sub-tasks. Write `flatten(list, depth)`. It returns a new array where the items of inner lists are taken up into the outer list, `depth` levels down. When `depth` is left out, it is `1`.

An empty spot in any list that gets flattened is left out of the result. Only arrays count as lists: an object stays an item.

Example 1: flatten(["shop", ["milk", ["oat", "soy"]]])  ->  ["shop", "milk", ["oat", "soy"]]
Example 2: flatten(["shop", ["milk", ["oat", "soy"]]], 2)  ->  ["shop", "milk", "oat", "soy"]
Example 3: flatten(["a", , "b"])  ->  ["a", "b"]

Note: solve it without the built-in `flat` and `flatMap`.
