# Role Permissions (medium)

`permissions(role)` should return the list of things a role may do.

- A `"viewer"` may `"read"`.
- An `"editor"` may `"write"`, and do all that a viewer may.
- An `"admin"` may `"delete"`, and do all that an editor may.
- Any other role may do nothing.

The list starts with what only that role adds. The code below gives each role one thing only, and gives an unknown role `"none"`. Fix it.

Example 1: permissions("admin")  ->  ["delete", "write", "read"]
Example 2: permissions("editor")  ->  ["write", "read"]
Example 3: permissions("guest")  ->  []
