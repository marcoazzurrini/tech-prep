# Coin Wallet (easy)

Write a class `Wallet`. `new Wallet(owner)` makes a wallet with two properties: `owner`, and `coins`, which starts at `0`.

- `add(amount)` adds coins and returns the new number of coins.
- `spend(amount)` takes coins out and returns `true`. When the wallet holds fewer coins than `amount`, it changes nothing and returns `false`.
- `transferTo(other, amount)` moves coins from this wallet to the wallet `other`. It returns `true` when the coins moved, and `false` when this wallet holds too few.

Example 1:
  const ada = new Wallet("Ada");
  const leo = new Wallet("Leo");
  ada.add(9)  ->  9
  ada.transferTo(leo, 4)  ->  true
  ada.coins  ->  5
  leo.coins  ->  4
  leo.spend(10)  ->  false
