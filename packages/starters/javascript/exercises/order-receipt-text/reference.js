const capital = (name) => `${name[0].toUpperCase()}${name.slice(1)}`;

export function receipt(items) {
  let total = 0;
  const lines = [];

  for (const item of items) {
    const cost = item.qty * item.price;

    total += cost;
    lines.push(`${item.qty} x ${capital(item.name)} = ${cost}`);
  }

  lines.push(`Total: ${total}`);

  return lines.join("\n");
}
