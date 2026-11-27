# Comparable Values (medium)

Write an object `comparable` with four methods. Each one works on any object that has a method `compareTo(other)`. `compareTo` returns a negative number when the object is smaller than `other`, `0` when they are equal, and a positive number when it is bigger.

- `equals(other)`, `lessThan(other)` and `greaterThan(other)` return `true` or `false`.
- `between(low, high)` returns `true` when the object is at least `low` and at most `high`.

Then write a class `Version`. `new Version(major, minor)` makes a version such as 1.2. It compares by `major` first, then by `minor`. Every version must have the four methods of `comparable`. Write them only once, in `comparable`.

Example 1: new Version(1, 2).lessThan(new Version(1, 10))  ->  true
Example 2: new Version(2, 0).greaterThan(new Version(1, 9))  ->  true
Example 3: new Version(1, 5).between(new Version(1, 0), new Version(2, 0))  ->  true
