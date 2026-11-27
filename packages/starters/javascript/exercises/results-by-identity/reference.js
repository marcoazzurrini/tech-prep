const newNode = () => ({ next: new Map(), done: false, result: undefined });

export function memoize(fn) {
  const root = newNode();

  return function (...args) {
    let node = root;

    for (const arg of args) {
      if (!node.next.has(arg)) {
        node.next.set(arg, newNode());
      }

      node = node.next.get(arg);
    }

    if (!node.done) {
      node.result = fn.apply(this, args);
      node.done = true;
    }

    return node.result;
  };
}
