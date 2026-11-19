export function codesWithoutRepeats(
  digits: number[],
  length: number
): number[][] {
  const result: number[][] = [];
  const code: number[] = [];
  const used: boolean[] = new Array(digits.length).fill(false);

  const backtrack = (): void => {
    if (code.length === length) {
      result.push([...code]);
      return;
    }
    for (let i = 0; i < digits.length; i++) {
      if (used[i]) continue; // already in this code
      used[i] = true;
      code.push(digits[i]!);
      backtrack();
      code.pop();
      used[i] = false; // release
    }
  };

  backtrack();
  return result;
}
