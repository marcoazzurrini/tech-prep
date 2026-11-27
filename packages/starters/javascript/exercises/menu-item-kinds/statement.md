# Menu Item Kinds (easy)

Write three classes: `Item`, and its two child classes `Drink` and `Dish`.

- `new Item(name, price)` stores `name` and `price`.
- `item.line()` returns the text `"<name>: <price>"`.
- `Item.parse(text)` is static. It takes text such as `"tea:3"` and returns a new instance of the class it was called on. The price is a number.
- `Drink` adds `refill()`, which returns `"More <name>"`.
- `Dish` adds `half()`, which returns half the price.

Example 1:
  const tea = Drink.parse("tea:3");
  tea.line()  ->  "tea: 3"
  tea.refill()  ->  "More tea"
  tea instanceof Drink  ->  true
Example 2: Dish.parse("pie:8").half()  ->  4

Note: Write the constructor, `line` and `parse` once, in `Item`. The child classes inherit them.
