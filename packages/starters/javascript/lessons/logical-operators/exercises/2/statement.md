`managerName(employee)` should return the name of the employee's manager. The `manager` property holds another employee, or `null` for the person at the top.

The code below throws when there is no manager. Make it return `null` then.

Example 1: managerName({ name: "Bo", manager: { name: "Ada", manager: null } })  ->  "Ada"
Example 2: managerName({ name: "Ada", manager: null })  ->  null
