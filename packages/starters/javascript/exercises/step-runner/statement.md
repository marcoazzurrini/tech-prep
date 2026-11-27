# Step Runner (hard)

Write `run(task)`. `task` is a generator function. `run` calls it, then drives the generator to the end.

Each value the generator yields is a function with no arguments. `run` calls that function and sends its result back in, as the result of the `yield`. If the function throws, `run` throws the same error into the generator, at that `yield`. The generator may catch it and carry on.

`run` returns what the generator returns. An error the generator does not catch comes out of `run`.

Example 1:
  run(function* () {
    const a = yield () => 2;
    const b = yield () => a * 5;
    return b + 1;
  })  ->  11
