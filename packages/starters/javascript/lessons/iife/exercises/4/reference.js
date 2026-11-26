export const tally = (function () {
  const counts = new Map();

  function votes(name) {
    return counts.get(name) ?? 0;
  }

  function add(name) {
    counts.set(name, votes(name) + 1);
  }

  function reset() {
    counts.clear();
  }

  return { add, reset, votes };
})();
