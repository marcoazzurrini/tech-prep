export function nearestTallerOnLeft(heights: number[]): number[] {
  const answer: number[] = [];
  const stack: number[] = []; // indexes of people, tallest at the bottom
  for (let i = 0; i < heights.length; i++) {
    // Nobody to the right will ever pick a person who is not taller than this one.
    while (
      stack.length > 0 &&
      heights[stack[stack.length - 1]!]! <= heights[i]!
    ) {
      stack.pop();
    }
    // Whoever is left on top is the nearest taller person.
    answer.push(stack[stack.length - 1] ?? -1);
    stack.push(i);
  }
  return answer;
}
