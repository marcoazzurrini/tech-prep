export function describeKeys(obj) {
  const visible = Object.keys(obj);
  const hidden = Object.getOwnPropertyNames(obj).filter((key) => !visible.includes(key));
  const symbols = Object.getOwnPropertySymbols(obj).length;
  const inherited = [];

  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) {
      inherited.push(key);
    }
  }

  return { visible, hidden, symbols, inherited };
}
