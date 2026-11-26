export function highestBid(bids) {
  let best = { name: "nobody", amount: 0 };

  for (const bid of bids) {
    if (bid.amount > best.amount) {
      best = bid;
    }
  }

  return best.name;
}
