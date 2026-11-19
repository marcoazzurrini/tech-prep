# In-Place Markers

Sometimes you need one flag per item, but the task allows no extra memory. Then store the flags inside the input. A cell can hold its own value and one flag, if the flag is something the value never uses. A minus sign is a common choice.

## Worked example

The array has 5 values, each from 1 to 5. Find which values are missing.

```ts
const nums = [3, 1, 3, 5, 1];

// a negative number at index v - 1 means: "the value v was seen"
for (const num of nums) {
  const v = Math.abs(num);
  if (nums[v - 1] > 0) nums[v - 1] = -nums[v - 1];
}

const missing: number[] = [];
for (let i = 0; i < nums.length; i++) {
  if (nums[i] > 0) missing.push(i + 1);
}

// missing is [2, 4]
```

## Why it works

- All values are positive at the start. So the sign is free to use as a flag.
- `Math.abs(num)` reads the real value. The cell may already carry a flag for another value.
- The `> 0` check sets each flag once. Flipping the sign twice would erase it.

## When to use it

- The task says "constant extra space" or "in place", and you want a set or a row of flags.
- The values are in a known range, such as 1 to n. Then a value can point to an index.
- In a matrix, the first row and the first column can hold one flag for each column and each row.
