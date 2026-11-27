# Cleanup Stack (medium)

Write `makeStack()`. It returns a resource that `using` can dispose. It has a method `defer(fn)`, which adds a cleanup function to the stack.

When the stack is disposed, call every cleanup function in reverse order: the last one added runs first. Dispose only once. A second dispose does nothing.

If a cleanup function throws, still call the others. When all have run, throw the first error that was thrown.

Example 1:
  const log = [];
  { using s = makeStack(); s.defer(() => log.push(1)); s.defer(() => log.push(2)); }
  log  ->  [2, 1]
Example 2:
  const s = makeStack(); s.defer(() => { throw new Error("bad"); });
  s[Symbol.dispose]()  ->  throws the error "bad"

Note: Solve it without `DisposableStack`.
