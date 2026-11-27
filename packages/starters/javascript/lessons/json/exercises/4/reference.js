export function parseNumbers(text) {
  return JSON.parse(text, (key, value) => {
    if (key.startsWith("num_") && typeof value === "string") {
      return Number(value);
    }
    return value;
  });
}
