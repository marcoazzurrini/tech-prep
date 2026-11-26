# Line Up the Keys (medium)

Some keys are added to an empty object, one by one. Write `listedKeys(keys)`. It takes the keys in the order they were added, and returns them in the order in which `Object.keys` would list them.

Each key is a string, and no key appears twice.

Example 1: listedKeys(["b", "10", "a", "2"])  ->  ["2", "10", "b", "a"]
Example 2: listedKeys(["x", "y"])  ->  ["x", "y"]

Note: Solve it without building an object. No key is a number above one million.
