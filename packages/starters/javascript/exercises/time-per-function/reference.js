export function ownTimes(records) {
  const times = {};
  const running = [];
  let last = 0;

  for (const [time, kind, name] of records) {
    const current = running.at(-1);

    if (current !== undefined) {
      times[current] += time - last;
    }

    if (kind === "start") {
      running.push(name);
      times[name] ??= 0;
    } else {
      running.pop();
    }

    last = time;
  }

  return times;
}
