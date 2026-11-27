Write `toPlain(error)`. It returns a plain object with the error's `name` and `message`, so that the error can be sent as JSON.

When the error has a `cause`, add a `cause` field too. If the cause is an error, turn it into a plain object in the same way. Otherwise keep the value as it is.

Example 1: toPlain(new TypeError("bad type"))  ->  { name: "TypeError", message: "bad type" }
Example 2:
  toPlain(new Error("save failed", { cause: new RangeError("too big") }))
  ->  { name: "Error", message: "save failed", cause: { name: "RangeError", message: "too big" } }
Example 3:
  toPlain(new Error("not found", { cause: 404 }))
  ->  { name: "Error", message: "not found", cause: 404 }
