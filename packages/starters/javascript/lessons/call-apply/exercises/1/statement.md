`shoppingLine(item, quantity, unit)` should return a line such as `"500 g of flour"`.

The helper `line` reads the item's name from `this`. The code below calls `line` plainly, so it throws. Fix the call, and leave `line` as it is.

Example 1: shoppingLine({ name: "flour" }, 500, "g")  ->  "500 g of flour"
