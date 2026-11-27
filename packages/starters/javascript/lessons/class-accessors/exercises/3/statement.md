Write a class `Units` that holds settings for the whole app. It has no instances: everything is static.

- `Units.all` is a static getter. It gives the array `["mm", "cm", "m"]`. Each read gives a new copy, so changing it changes nothing.
- `Units.default` is a static getter and setter. It starts as `"cm"`. The setter throws a `RangeError` for a unit that is not in the list, and keeps the old one.

`Object.keys(Units)` must give `[]`.

Example 1: Units.default  ->  "cm"
Example 2: Units.all  ->  ["mm", "cm", "m"]
Example 3: Units.default = "km"  ->  throws a RangeError
