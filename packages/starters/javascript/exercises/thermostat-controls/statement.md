# Thermostat (medium)

Write `createThermostat(degrees)`. It returns an object with a property `degrees` and a method `controls()`.

`controls()` returns an object with two functions, `warmer` and `cooler`. Each one changes the thermostat's `degrees` by 1 and returns the new value. They must work however they are called.

Example 1:
  const thermostat = createThermostat(20);
  const { warmer, cooler } = thermostat.controls();
  warmer()  ->  21
  warmer()  ->  22
  cooler()  ->  21
  thermostat.degrees  ->  21
