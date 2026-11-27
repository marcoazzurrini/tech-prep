export function finalBalance(start, transactions) {
  return transactions.reduce((balance, { type, amount }) => {
    if (type === "deposit") {
      return balance + amount;
    }

    return amount <= balance ? balance - amount : balance;
  }, start);
}
