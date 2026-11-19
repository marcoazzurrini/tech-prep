export function canCompleteCircuit(gas: number[], cost: number[]): number {
  // Less fuel than cost in total: no start can work.
  let total = 0;
  for (let i = 0; i < gas.length; i++) total += gas[i] - cost[i];
  if (total < 0) return -1;

  let start = 0;
  let tank = 0;
  for (let i = 0; i < gas.length; i++) {
    tank += gas[i] - cost[i];
    // The run from `start` fails here, and so does every start inside it.
    // Restart at the next station.
    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }
  return start;
}
