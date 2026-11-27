export function biggestSwing(readings) {
  const changes = [];

  for (let i = 1; i < readings.length; i += 1) {
    changes.push(Math.abs(readings[i] - readings[i - 1]));
  }

  return changes.length === 0 ? 0 : Math.max(...changes);
}
