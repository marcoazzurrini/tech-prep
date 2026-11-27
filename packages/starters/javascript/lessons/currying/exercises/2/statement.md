Write `curry(fn, arity)`. It returns a curried version of `fn`. `arity` is the number of arguments to wait for. The curried function collects arguments over one or more calls, and a call may pass several. Once it has at least `arity` arguments, it calls `fn` with all of them and returns the result.

When `arity` is left out, use `fn.length`. Each function returned on the way can be used many times.

Example 1:
  const add = curry((a, b, c) => a + b + c);
  add(1)(2)(3)  ->  6
  add(1, 2)(3)  ->  6
Example 2:
  const join = curry((...parts) => parts.join("-"), 3);
  join("a")("b", "c")  ->  "a-b-c"
