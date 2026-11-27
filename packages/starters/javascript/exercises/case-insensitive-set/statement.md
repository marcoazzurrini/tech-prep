# Case-Insensitive Set (easy)

Write `class CaseInsensitiveSet extends Set`.

String values added to, checked in, or deleted from the set are matched without regard to letter case, and stored in lowercase. Non-string values are kept as they are.

`add(value)` must still return `this`, and `delete(value)` must return a boolean. Passing an iterable to `new CaseInsensitiveSet(values)` must also normalise strings.

Example 1:
  const s = new CaseInsensitiveSet(["JS", "js", "TS"]);
  s.size  ->  2
  s.has("ts")  ->  true

Example 2:
  const s = new CaseInsensitiveSet();
  s.add("Hello").has("HELLO")  ->  true
  s.delete("hello")  ->  true
  s.size  ->  0
