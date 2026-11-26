# Tidy Record (medium)

Write `tidyRecord(record)`. It takes an object and returns a new object without the properties that hold no data.

A property holds no data when its value is `null`, `undefined`, `NaN` or an empty string. Every other value stays, including `0` and `false`.

Example 1: tidyRecord({ name: "Ada", age: 0, city: "" })  ->  { name: "Ada", age: 0 }
Example 2: tidyRecord({ score: NaN, done: false })  ->  { done: false }

Note: Do not change the object that was passed in.
