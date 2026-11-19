export function findJudge(n: number, trust: number[][]): number {
  // Count the edges that leave each person and the edges that arrive.
  const trusts = new Array<number>(n + 1).fill(0);
  const trustedBy = new Array<number>(n + 1).fill(0);
  for (const [a, b] of trust) {
    trusts[a!]!++;
    trustedBy[b!]!++;
  }
  // The judge trusts nobody and is trusted by the other n - 1 people.
  for (let person = 1; person <= n; person++) {
    if (trusts[person] === 0 && trustedBy[person] === n - 1) return person;
  }
  return -1;
}
