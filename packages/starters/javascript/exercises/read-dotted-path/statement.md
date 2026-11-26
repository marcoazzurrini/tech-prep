# Read a Path (medium)

Write `readPath(data, path)`. `data` is an object, and `path` is a string of property names with dots between them, such as `"user.address.city"`.

Follow the names one by one, starting from `data`, and return the value at the end. When a name on the way is not there, return the string `"missing"`.

A `null` at the end of the path is a real value: return it. A `null` in the middle of the path has no properties, so the result is `"missing"`.

Example 1: readPath({ user: { name: "Ada" } }, "user.name")  ->  "Ada"
Example 2: readPath({ user: { name: "Ada" } }, "user.age")  ->  "missing"
Example 3: readPath({ user: { boss: null } }, "user.boss")  ->  null
Example 4: readPath({ user: { boss: null } }, "user.boss.name")  ->  "missing"
