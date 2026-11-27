export function formatAmount(amount) {
  return amount.replace(/(?<!\.\d*)\B(?=(\d{3})+(?!\d))/g, ",");
}
