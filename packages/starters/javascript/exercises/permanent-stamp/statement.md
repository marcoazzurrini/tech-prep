# Permanent Stamp (medium)

Write `stamp(obj, code)` and `readStamp(obj)`.

`stamp(obj, code)` marks `obj` with `code` and returns `true`. If `obj` is already marked, it leaves the original mark alone and returns `false`. The mark must stay hidden from `Object.keys(obj)`, `for...in`, `JSON.stringify(obj)` and shallow copies made with `{ ...obj }`. Once set, the mark cannot be overwritten or deleted.

`readStamp(obj)` returns the mark on `obj`, or `undefined` if `obj` has none.

Example 1:
  const doc = { title: "Plan" };
  stamp(doc, "S1")  ->  true
  readStamp(doc)  ->  "S1"
  Object.keys(doc)  ->  ["title"]

Example 2:
  const doc = { title: "Plan" };
  stamp(doc, "S1")  ->  true
  stamp(doc, "S2")  ->  false
  readStamp(doc)  ->  "S1"
