# Snake Keys to Camel Keys (medium)

Write `camelKeys(value)`. It takes data parsed from JSON, whose keys are written like `first_name`: small letters and digits joined by `_`. A key never starts or ends with `_`.

Return a copy where every key is written like `firstName`: each `_` is removed and the character after it becomes a capital. Convert the keys of nested objects and of objects inside arrays too. Leave every other value as it is, strings included.

Example 1: camelKeys({ user_id: 1, first_name: "Ada" })  ->  { userId: 1, firstName: "Ada" }
Example 2: camelKeys({ address_line_2: "Flat 3" })  ->  { addressLine2: "Flat 3" }
Example 3: camelKeys([{ is_open: true }, "keep_me"])  ->  [{ isOpen: true }, "keep_me"]
