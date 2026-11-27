# Arguments in Stages (medium)

Write `inStages(fn)`. It returns a function that takes the arguments of `fn` over one or more calls, any number in each call.

As soon as it has at least as many arguments as `fn` declares, it calls `fn` with all of them and returns the result. Until then, each call returns a new function that waits for more. A function returned on the way can be used many times, and each use is separate from the others.

"Declares" means `fn.length`. A function that declares nothing runs at the first call.

Example 1:
  const add = inStages((a, b, c) => a + b + c);
  add(1)(2)(3)  ->  6
  add(1, 2)(3)  ->  6
Example 2:
  const one = add(1);
  one(2)(3)  ->  6
  one(10, 20)  ->  31
