export function limitCalls(fn, max) {
  let calls = 0;
  let result;

  return function (...args) {
    if (calls < max) {
      calls += 1;
      result = fn.apply(this, args);
    }

    return result;
  };
}
