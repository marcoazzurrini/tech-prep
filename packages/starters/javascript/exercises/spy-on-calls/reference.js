export function spy(fn) {
  const record = [];

  const spied = (...args) => {
    record.push(args);

    return fn(...args);
  };

  spied.count = () => record.length;
  spied.calls = () => [...record];

  return spied;
}
