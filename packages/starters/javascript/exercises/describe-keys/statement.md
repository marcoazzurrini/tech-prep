# Describe the Keys (medium)

Write `describeKeys(obj)`. It returns an object with four properties:

- `visible`: the own enumerable string keys.
- `hidden`: the own string keys that are not enumerable.
- `symbols`: how many own symbol keys there are.
- `inherited`: the enumerable string keys that come from the prototype chain, leaving out any key the object has itself.

Give the keys in the order the language lists them.

Example 1: describeKeys({ a: 1, [Symbol("s")]: 2 })  ->  { visible: ["a"], hidden: [], symbols: 1, inherited: [] }
Example 2: describeKeys([7, 8])  ->  { visible: ["0", "1"], hidden: ["length"], symbols: 0, inherited: [] }
