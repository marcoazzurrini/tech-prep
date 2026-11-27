`ownerName(ref)` takes a `WeakRef` to a user. It should return the user's name, or `"gone"` once the user has been collected.

The code below throws when the user is gone. Fix it.

Collection cannot be forced, so the tests stand in for a collected user with `{ deref: () => undefined }`.

Example 1: ownerName(new WeakRef({ name: "Ada" }))  ->  "Ada"
Example 2: ownerName({ deref: () => undefined })  ->  "gone"
Example 3: ownerName({ deref: () => ({ name: "" }) })  ->  ""
