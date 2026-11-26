`toCelsius` and `toFahrenheit` are written for you.

Write `converterTo(unit)`. It returns `toCelsius` when `unit` is `"C"`, and `toFahrenheit` when it is `"F"`. It returns the function itself. It does not call it.

Example 1: converterTo("C")(212)  ->  100
Example 2: converterTo("F")(100)  ->  212
Example 3: typeof converterTo("C")  ->  "function"
