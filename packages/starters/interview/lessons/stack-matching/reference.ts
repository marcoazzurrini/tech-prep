export function bracketPairs(s: string): number[][] {
  const pairs: number[][] = [];
  const stack: number[] = []; // indexes of the brackets that are still open
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      stack.push(i);
    } else if (s[i] === ")") {
      // The newest open bracket is the partner.
      pairs.push([stack.pop()!, i]);
    }
  }
  return pairs;
}
