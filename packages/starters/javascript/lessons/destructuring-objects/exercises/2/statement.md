Write `badge(user)`. It returns the user's name and role as text, such as `"Ada (admin)"`.

A user with no `name` is called `"Guest"`, and a user with no `role` is a `"member"`. When `user` is `null`, both are missing.

Example 1: badge({ name: "Ada", role: "admin" })  ->  "Ada (admin)"
Example 2: badge({ name: "Ben" })  ->  "Ben (member)"
Example 3: badge(null)  ->  "Guest (member)"
