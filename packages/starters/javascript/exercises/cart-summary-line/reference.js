const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const list = new Intl.ListFormat("en-US", { type: "conjunction" });
const plural = new Intl.PluralRules("en-US");

export function cartSummary(items) {
  if (items.length === 0) {
    return "Your cart is empty";
  }

  const total = items.reduce((sum, item) => sum + item.price, 0);
  const word = plural.select(items.length) === "one" ? "item" : "items";
  const names = list.format(items.map((item) => item.name));

  return `${items.length} ${word} (${names}) for ${money.format(total)}`;
}
