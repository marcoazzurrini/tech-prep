export function countdown(from, ms, onTick, onDone) {
  let left = from;
  let stopped = false;

  const stop = () => {
    stopped = true;
    clearInterval(id);
  };

  const id = setInterval(() => {
    onTick(left);
    left--;

    if (left === 0 && !stopped) {
      stop();
      onDone();
    }
  }, ms);

  return stop;
}
