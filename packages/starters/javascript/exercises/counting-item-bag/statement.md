# Counting Item Bag (medium)

Write a class `Bag`. `bag.add(item)` puts one item in the bag and returns the bag, so calls can chain. The same item can go in many times.

- Spread or `for...of` gives every item. Copies of one item come together, and items come in the order they first went in.
- As a string, a bag reads `"3 items"`, or `"1 item"` when it holds one.
- In maths, such as `bag * 10`, a bag is the number of items it holds.
- `Object.prototype.toString.call(bag)` gives `"[object Bag]"`.

Example 1: [...new Bag().add("pear").add("fig").add("pear")]  ->  ["pear", "pear", "fig"]
Example 2: `${new Bag().add("a").add("a")}`  ->  "2 items"
Example 3: new Bag().add("x").add("y") * 10  ->  20
