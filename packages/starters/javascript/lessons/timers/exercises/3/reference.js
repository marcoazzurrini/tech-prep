export function tick(times, ms, onTick) {
  let count = 0;

  const id = setInterval(() => {
    count++;
    onTick(count);

    if (count === times) {
      clearInterval(id);
    }
  }, ms);
}
