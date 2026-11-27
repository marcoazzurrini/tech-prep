Write `attachSecret(obj, value)`. It creates a new symbol, stores `value` on `obj` under that symbol key, and returns the symbol.

Example 1:
  const user = { name: "Ada" };
  const key = attachSecret(user, 42);
  user[key]  ->  42
  Object.keys(user)  ->  ["name"]
