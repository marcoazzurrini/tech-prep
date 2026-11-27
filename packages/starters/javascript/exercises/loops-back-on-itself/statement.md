# Loops Back on Itself (medium)

Write `hasCycle(value)`. `value` is made of plain objects, arrays and primitives. Return `true` when some object or array contains itself, directly or through a chain of other objects. Otherwise return `false`.

The same object can appear in several places without a loop. That alone is not a cycle.

Example 1:
  const a = {};
  a.self = a;
  hasCycle(a)  ->  true

Example 2:
  const shared = { n: 1 };
  hasCycle({ x: shared, y: [shared, shared] })  ->  false

Example 3: hasCycle(5)  ->  false
