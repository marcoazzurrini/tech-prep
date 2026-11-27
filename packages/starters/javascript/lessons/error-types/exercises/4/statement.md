Write `splitBill(total, people)`. It returns each person's share of the bill, rounded to two decimals.

Check the arguments first. If `total` or `people` is not a number, throw a `TypeError`. If `people` is not a whole number of at least 1, throw a `RangeError`. Give each error a message of your choice.

Example 1: splitBill(30, 3)  ->  10
Example 2: splitBill(10, 3)  ->  3.33
Example 3: splitBill("30", 3)  ->  throws a TypeError
Example 4: splitBill(30, 0)  ->  throws a RangeError
