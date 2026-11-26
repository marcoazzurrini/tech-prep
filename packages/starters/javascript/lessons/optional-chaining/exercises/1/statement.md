Write `ownerEmail(project)`. It returns the email of the project's owner.

Return `"nobody"` when the project has no owner, or when the owner has no email. A missing owner or email is `null`, or is not on the object.

Example 1: ownerEmail({ owner: { email: "ada@example.com" } })  ->  "ada@example.com"
Example 2: ownerEmail({ owner: null })  ->  "nobody"
Example 3: ownerEmail({ owner: { name: "Bo" } })  ->  "nobody"
