# Same Store State (medium)

A shop app keeps its state in plain objects and arrays, with maps and sets inside. Write `sameState(a, b)`. It returns `true` when the two states hold the same data, at any depth.

- Primitives are the same when `Object.is` says so.
- Two maps are the same when they have the same keys, and the same data under each key. The keys are primitives.
- Two sets are the same when they hold the same items. The items are primitives.
- Arrays, plain objects, maps and sets are four different kinds. Two values of different kinds are never the same.
- Two plain objects are the same when they have the same own keys, in any order, with the same data under each.

Example 1:
  sameState({ cart: new Map([["pen", { qty: 2 }]]) }, { cart: new Map([["pen", { qty: 2 }]]) })  ->  true
Example 2:
  sameState(new Set(["a", "b"]), new Set(["b", "a"]))  ->  true
Example 3:
  sameState(new Map(), {})  ->  false
