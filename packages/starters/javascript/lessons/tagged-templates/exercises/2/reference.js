export function money(strings, ...values) {
  let out = strings[0];

  values.forEach((value, i) => {
    out += "€" + value + strings[i + 1];
  });

  return out;
}
