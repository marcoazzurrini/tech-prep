# Skipping Duplicates

A sorted array keeps equal values side by side. After you use a value, move the pointer past all its copies. Then each distinct answer comes out once. You need no set to remove repeats.

## Worked example

List each distinct pair of values that adds up to 10. The array is sorted.

```ts
const nums = [2, 2, 4, 6, 8, 8];
const pairs: number[][] = [];
let left = 0;
let right = nums.length - 1;

while (left < right) {
  const sum = nums[left] + nums[right];
  if (sum < 10) left++;
  else if (sum > 10) right--;
  else {
    pairs.push([nums[left], nums[right]]);
    left++;
    while (left < right && nums[left] === nums[left - 1]) left++;
  }
}
// pairs: [[2, 8], [4, 6]]
```

## Why it works

- The inner `while` runs after a match. It moves `left` past every copy of the value just used, so that value cannot start a second pair.
- `nums[left] === nums[left - 1]` compares with the neighbour behind. That only finds all copies because the array is sorted.
- `left < right` stops the skip before the pointers cross.

## When to use it

- The task asks for "distinct" or "unique" results, and the input can hold repeats.
- The answer is made of values, not indices, so you may sort.
- You use a sorted array with pointers and the same answer comes out more than once.
