# Stock Room (medium)

Write `createStockRoom()`. It returns an object with three functions:

- `add(item, amount)` puts `amount` units of `item` in the room.
- `take(item, amount)` removes `amount` units of `item` and returns `true`. When the room holds fewer than that, it removes nothing and returns `false`.
- `count(item)` returns how many units of `item` the room holds. An item it has never seen gives 0.

The object has no other properties.

Example 1:
  const room = createStockRoom();
  room.add("tea", 5);
  room.take("tea", 2)  ->  true
  room.take("tea", 9)  ->  false
  room.count("tea")  ->  3
