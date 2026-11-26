# Order from Template (easy)

`startOrder(customer)` should return a new order for a customer: an object with the customer's name, an empty `items` array and `paid` set to `false`.

Every order must be separate. With the code below, a change to one order shows up in all the others. Fix it.

Example 1: startOrder("Ada")  ->  { customer: "Ada", items: [], paid: false }
Example 2:
  const a = startOrder("Ada");
  const b = startOrder("Bo");
  a.items.push("tea");
  b.items  ->  []
