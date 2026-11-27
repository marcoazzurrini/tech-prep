export function formatMoney(symbol) {
  return (decimals) => (amount) => symbol + amount.toFixed(decimals);
}
