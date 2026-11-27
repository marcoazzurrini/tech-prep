Write a class `Thermostat`. `new Thermostat(target)` keeps a target temperature that is always between `10` and `30`. A value below `10` becomes `10`, and a value above `30` becomes `30`.

- `set(value)` changes the target and returns the new target.
- `target()` returns the target.
- `Thermostat.made()` returns how many thermostats have been made.

Keep the target and the count in private members, and do the clamping in a private method. `Object.keys` of a thermostat and of the class must both give `[]`.

Example 1: new Thermostat(21).target()  ->  21
Example 2: new Thermostat(21).set(40)  ->  30
Example 3: new Thermostat(50).target()  ->  30
