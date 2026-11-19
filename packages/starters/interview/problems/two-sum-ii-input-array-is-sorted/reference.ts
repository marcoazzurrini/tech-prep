export function twoSumSorted(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    const total = numbers[left] + numbers[right];
    if (total === target) return [left + 1, right + 1]; // positions count from 1
    if (total < target) left++; // only a larger left value can raise the sum
    else right--; // only a smaller right value can lower the sum
  }
  return [];
}
