# Safe Stringify (medium)

Write `safeStringify(value)`. It converts `value` to a JSON string without throwing on `BigInt` values or circular references.

Convert any `BigInt` value to its decimal string. Replace any repeated circular object reference with `"[Circular]"`.

Example 1: safeStringify({ id: 10n, name: "Ada" })  ->  '{"id":"10","name":"Ada"}'
Example 2:
  const node = { name: "root" };
  node.self = node;
  safeStringify(node)  ->  '{"name":"root","self":"[Circular]"}'
