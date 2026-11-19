export function smoothSequences(length: number, maxValue: number): number[][] {
  const result: number[][] = [];
  const seq: number[] = [];

  const backtrack = (): void => {
    if (seq.length === length) {
      result.push([...seq]);
      return;
    }
    for (let value = 1; value <= maxValue; value++) {
      // Check the rule before the choice.
      if (seq.length > 0 && Math.abs(value - seq[seq.length - 1]!) > 1)
        continue;
      seq.push(value);
      backtrack();
      seq.pop();
    }
  };

  backtrack();
  return result;
}
