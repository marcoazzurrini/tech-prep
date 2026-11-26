# Leave Out Keys (medium)

Write `leaveOut(record, keys)`. It returns a new object with every property of `record`, except the ones whose names are in the array `keys`.

It must not change `record`. A name in `keys` that `record` does not have is ignored.

Example 1: leaveOut({ id: 1, name: "Ada", age: 36 }, ["age"])  ->  { id: 1, name: "Ada" }
Example 2: leaveOut({ id: 1, name: "Ada" }, ["id", "name", "email"])  ->  {}
Example 3: leaveOut({ id: 1 }, [])  ->  { id: 1 }
