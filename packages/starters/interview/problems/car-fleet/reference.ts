export function carFleet(
  target: number,
  position: number[],
  speed: number[]
): number {
  // Visit the cars from the one nearest the target to the one farthest.
  const cars = position.map((pos, i) => [pos, speed[i]!] as const);
  cars.sort((a, b) => b[0] - a[0]);
  const stack: number[] = []; // arrival time of each fleet, slowest fleet on top
  for (const [pos, spd] of cars) {
    stack.push((target - pos) / spd);
    // This car arrives no later than the fleet ahead: it joins that fleet.
    if (
      stack.length >= 2 &&
      stack[stack.length - 1]! <= stack[stack.length - 2]!
    ) {
      stack.pop();
    }
  }
  return stack.length;
}
