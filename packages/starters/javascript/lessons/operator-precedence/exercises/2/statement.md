`canEdit(user)` should return `true` for an admin and for the owner. For a locked account it should always return `false`.

The code below lets a locked admin in. Fix it.

Example 1: canEdit({ admin: true, owner: false, locked: false })  ->  true
Example 2: canEdit({ admin: true, owner: false, locked: true })  ->  false
Example 3: canEdit({ admin: false, owner: false, locked: false })  ->  false
