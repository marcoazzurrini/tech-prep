# Method Handle (medium)

Write `handle(object, name)`. It returns a function that is safe to call on its own, or to pass as a callback.

Calling that function calls the method `object[name]` on `object`, with the same arguments, and returns its result.

The method is looked up at each call. If `object[name]` is replaced later, the new method is the one that runs.

Example 1:
  const user = { name: "Ada", greet(word) { return word + ", " + this.name; } };
  const greet = handle(user, "greet");
  greet("Hi")  ->  "Hi, Ada"
