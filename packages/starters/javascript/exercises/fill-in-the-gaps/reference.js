export const _ = Symbol("gap");

export function partial(fn, ...fixed) {
  return function (...rest) {
    let next = 0;
    const args = fixed.map((arg) => (arg === _ ? rest[next++] : arg));

    return fn.apply(this, [...args, ...rest.slice(next)]);
  };
}
