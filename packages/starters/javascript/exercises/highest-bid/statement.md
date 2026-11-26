# Highest Bid (easy)

`highestBid(bids)` takes an array of bids such as `{ name: "Ada", amount: 40 }`. It should return the name of the bidder with the highest amount, or `"nobody"` for an empty array. When two bids are equal, the earlier one wins.

The code below always returns `"nobody"`. Fix it.

Example 1: highestBid([{ name: "Ada", amount: 40 }, { name: "Bo", amount: 55 }])  ->  "Bo"
Example 2: highestBid([])  ->  "nobody"
