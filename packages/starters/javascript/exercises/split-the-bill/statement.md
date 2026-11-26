# Split the Bill (medium)

Write `splitBill(totalCents, people)`. It takes a bill in whole cents and the number of people who share it. It returns an array with each person's share, in whole cents.

The shares must add up to the bill exactly. When the bill does not divide evenly, the first people in the array pay one cent more.

Example 1: splitBill(1000, 3)  ->  [334, 333, 333]
Example 2: splitBill(100, 4)  ->  [25, 25, 25, 25]
Example 3: splitBill(2, 3)  ->  [1, 1, 0]
