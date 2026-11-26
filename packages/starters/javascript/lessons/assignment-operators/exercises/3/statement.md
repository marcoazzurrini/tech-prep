`totalsByCategory(expenses)` should add up the `amount` of the expenses in each `category`.

The code below gives `NaN` for every category. Fix it.

Example 1:
  totalsByCategory([{ category: "food", amount: 12 }, { category: "rent", amount: 500 }, { category: "food", amount: 8 }])
  ->  { food: 20, rent: 500 }
Example 2: totalsByCategory([])  ->  {}
