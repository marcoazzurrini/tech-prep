export function dailyTemperatures(temperatures: number[]): number[] {
  const answer: number[] = new Array(temperatures.length).fill(0);
  const stack: number[] = []; // days that still wait for a warmer day, warmest at the bottom
  for (let day = 0; day < temperatures.length; day++) {
    // Today is warmer than the day on top: that day has its answer.
    while (
      stack.length > 0 &&
      temperatures[day]! > temperatures[stack[stack.length - 1]!]!
    ) {
      const earlier = stack.pop()!;
      answer[earlier] = day - earlier;
    }
    stack.push(day);
  }
  return answer;
}
