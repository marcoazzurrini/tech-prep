Write `Logged(Base)`. It takes a class whose instances have a method `run(input)`, and returns a subclass of it.

An instance of the subclass has a `log` array, which starts empty. Its `run(input)` adds `input` to `log`, then returns what the base class's `run` returns.

Example 1:
  class Doubler { run(x) { return x * 2; } }
  const d = new (Logged(Doubler))();
  d.run(2)  ->  4
  d.run(5)  ->  10
  d.log  ->  [2, 5]
