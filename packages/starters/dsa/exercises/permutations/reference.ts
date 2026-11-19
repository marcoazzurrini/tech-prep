export function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  const perm: number[] = [];
  const used: boolean[] = new Array(nums.length).fill(false);

  const backtrack = (): void => {
    if (perm.length === nums.length) {
      result.push([...perm]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue; // already in this permutation
      used[i] = true;
      perm.push(nums[i]!);
      backtrack();
      perm.pop();
      used[i] = false; // release it for the next branch
    }
  };

  backtrack();
  return result;
}
