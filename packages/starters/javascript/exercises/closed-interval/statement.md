# Closed Interval (medium)

`new Interval(from, to)` stands for the whole numbers from `from` to `to`, both included. Make it work with the language:

- Spread or `for...of` gives each number in order. When `from` is greater than `to`, there are none.
- As a string, such as in a template literal, it reads `[from, to]`.
- In maths, such as `interval * 10`, it is the count of its numbers.
- `Object.prototype.toString.call(interval)` gives `"[object Interval]"`.
- `value instanceof Interval` is `true` for any object whose `from` and `to` are both numbers.

Example 1: [...new Interval(2, 5)]  ->  [2, 3, 4, 5]
Example 2: `${new Interval(1, 3)}`  ->  "[1, 3]"
Example 3: new Interval(1, 3) * 10  ->  30
Example 4: { from: 1, to: 2 } instanceof Interval  ->  true
