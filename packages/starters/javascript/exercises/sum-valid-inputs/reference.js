export function sumValid(inputs) {
  let sum = 0;

  for (const input of inputs) {
    const value = Number(input);

    if (input.trim() !== "" && !Number.isNaN(value)) {
      sum += value;
    }
  }

  return sum;
}
