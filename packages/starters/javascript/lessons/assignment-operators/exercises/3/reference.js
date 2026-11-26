export function totalsByCategory(expenses) {
  const totals = {};

  for (const expense of expenses) {
    totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount;
  }

  return totals;
}
