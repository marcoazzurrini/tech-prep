# Plugin Hooks (medium)

An editor lets plugins run code at named moments, such as `"save"` or `"open"`. Write `createHooks()`. It returns an object with three methods.

- `tap(name, fn)` adds `fn` to the moment `name`, and returns a function that removes it.
- `tapOnce(name, fn)` does the same, but `fn` runs one time only.
- `run(name, ...args)` calls every function of that moment with the arguments, in the order they were added.

A plugin may throw. `run` must still call all the other functions. It returns an array with the message of each error thrown, in order, or an empty array.

Example 1:
  const hooks = createHooks();
  hooks.tap("save", (file) => console.log(`lint ${file}`));
  hooks.tap("save", () => { throw new Error("disk full"); });
  hooks.run("save", "a.js")  ->  ["disk full"]   // prints "lint a.js"
