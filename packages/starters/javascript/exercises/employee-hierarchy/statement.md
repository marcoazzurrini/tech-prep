# Employee Hierarchy (medium)

Write constructor functions `Employee(name, basePay)` and `Manager(name, basePay, bonus)`.

- `Employee` sets own properties `name` and `basePay`, and puts `totalPay()` on `Employee.prototype` returning `this.basePay`.
- `Manager` sets `name`, `basePay` and `bonus` as own properties, inherits from `Employee`, sets `constructor` back to `Manager`, and overrides `totalPay()` to return `this.basePay + this.bonus`.

Example 1: new Employee("Ada", 5000).totalPay()  ->  5000
Example 2: new Manager("Grace", 5000, 1200).totalPay()  ->  6200

Note: Solve it without `class`.
