# Lock Listed Keys (medium)

Write `lockKeys(obj, keys)`. It takes an object and a list of key names, and returns the same object.

Each listed key becomes fixed: assigning to it throws a `TypeError`, and so does deleting it. Nothing else about the property changes. A key that `Object.keys` listed before is still listed.

Skip a listed key that the object does not have. Do not create it.

Example 1:
  const user = lockKeys({ id: 7, name: "Ada" }, ["id", "email"]);
  user.name = "Ben";  // works
  user.id = 8;  // throws a TypeError
  delete user.id;  // throws a TypeError
  Object.keys(user)  ->  ["id", "name"]
