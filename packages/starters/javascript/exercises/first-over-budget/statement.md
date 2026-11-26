# First Over Budget (medium)

`firstOverBudget(items, budget)` should add up the prices of a shopping list, in order. It returns the item that first takes the total above `budget`, as `{ index, name }`. When the whole list fits the budget, it returns `null`.

The code below always returns `null`. Fix it.

Example 1:
  firstOverBudget([{ name: "tea", price: 3 }, { name: "rice", price: 4 }, { name: "oil", price: 5 }], 6)
  ->  { index: 1, name: "rice" }
Example 2: firstOverBudget([{ name: "pen", price: 5 }, { name: "ink", price: 5 }], 10)  ->  null
