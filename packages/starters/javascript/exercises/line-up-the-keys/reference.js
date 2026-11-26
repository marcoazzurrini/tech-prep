const isWholeNumber = (key) => {
  const number = Number(key);

  return Number.isInteger(number) && number >= 0 && String(number) === key;
};

export function listedKeys(keys) {
  const numbers = keys.filter(isWholeNumber).toSorted((a, b) => a - b);
  const others = keys.filter((key) => !isWholeNumber(key));

  return [...numbers, ...others];
}
