# What Changed (medium)

Write `whatChanged(before, after, fields)`. `before` and `after` are two versions of a record, and `fields` lists the field names to compare.

Return an object that says what happened to each field:

- `"added"` when only `after` has the field
- `"removed"` when only `before` has the field
- `"changed"` when both have it, with different values

Leave out a field that is the same in both, or that neither has. A field that holds `null` is still a field.

Example 1:
  whatChanged({ name: "Ada", age: 36 }, { name: "Ada", age: 37, city: "Rome" }, ["name", "age", "city"])
  ->  { age: "changed", city: "added" }
Example 2: whatChanged({ phone: null }, {}, ["phone", "fax"])  ->  { phone: "removed" }

Constraints: Each value is a string, a number, a boolean or `null`. A field can have any name.
