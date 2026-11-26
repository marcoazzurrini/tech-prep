export function whatChanged(before, after, fields) {
  const result = {};

  for (const field of fields) {
    const was = Object.hasOwn(before, field);
    const is = Object.hasOwn(after, field);

    if (was && !is) {
      result[field] = "removed";
    } else if (!was && is) {
      result[field] = "added";
    } else if (was && before[field] !== after[field]) {
      result[field] = "changed";
    }
  }

  return result;
}
