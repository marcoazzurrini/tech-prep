# Names by Role (easy)

Write `namesByRole(users)`.

Each user has a `name` and a `role`. Return an object mapping each `role` to an array of the `name` strings in that role, keeping their original order.

Example 1: namesByRole([{ name: "Ada", role: "dev" }, { name: "Bo", role: "qa" }, { name: "Cy", role: "dev" }])  ->  { dev: ["Ada", "Cy"], qa: ["Bo"] }
Example 2: namesByRole([])  ->  {}
