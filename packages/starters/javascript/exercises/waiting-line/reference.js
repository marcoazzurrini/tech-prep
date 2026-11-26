export const line = (function () {
  const people = [];

  function join(name) {
    return people.push(name);
  }

  function serve() {
    return people.shift() ?? null;
  }

  function size() {
    return people.length;
  }

  function reset() {
    people.length = 0;
  }

  return { join, reset, serve, size };
})();
