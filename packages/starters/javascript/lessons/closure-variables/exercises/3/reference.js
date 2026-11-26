export function makeIdMaker(prefix) {
  let last = 0;

  return () => {
    last += 1;

    return `${prefix}-${last}`;
  };
}
