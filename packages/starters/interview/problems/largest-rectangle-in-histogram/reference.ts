export function largestRectangleArea(heights: number[]): number {
  let best = 0;
  const stack: [number, number][] = []; // [start index, height], heights increase toward the top
  for (let i = 0; i <= heights.length; i++) {
    const h = heights[i] ?? 0; // the last 0 pops every bar left
    let start = i;
    // A lower bar ends every taller rectangle on the stack.
    while (stack.length > 0 && stack[stack.length - 1]![1] > h) {
      const [from, height] = stack.pop()!;
      best = Math.max(best, height * (i - from));
      start = from;
    }
    // The new bar reaches back to where the popped bars began.
    stack.push([start, h]);
  }
  return best;
}
