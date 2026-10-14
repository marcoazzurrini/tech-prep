export function spiralOrder(matrix: number[][]): number[] {
  const result: number[] = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0]!.length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) result.push(matrix[top]![c]!);
    for (let r = top + 1; r <= bottom; r++) result.push(matrix[r]![right]!);
    // Only walk back along the bottom/left when they are distinct from top/right.
    if (top < bottom && left < right) {
      for (let c = right - 1; c >= left; c--) result.push(matrix[bottom]![c]!);
      for (let r = bottom - 1; r > top; r--) result.push(matrix[r]![left]!);
    }
    top++;
    bottom--;
    left++;
    right--;
  }
  return result;
}
