# Read the Pairs (medium)

A flat list holds a key, then its value, then the next key, and so on. `readPairs(flat)` should return an object built from these pairs. The list always has an even length.

The code below loses the first key and pairs up the wrong items. Fix it.

Example 1: readPairs(["name", "Ada", "age", 36])  ->  { name: "Ada", age: 36 }
Example 2: readPairs([])  ->  {}
