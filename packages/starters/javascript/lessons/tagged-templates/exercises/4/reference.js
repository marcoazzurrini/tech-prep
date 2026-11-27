export function pieces(strings, ...values) {
  const parts = [strings[0]];

  values.forEach((value, i) => {
    parts.push(value, strings[i + 1]);
  });

  return parts.filter((part) => part !== "");
}
