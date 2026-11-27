# Follow the Route (medium)

Write `route(start)`. It returns a promise of every stop from `start` to the end of the line, in order.

`nextStop(stop)` gives a promise of the stop after `stop`. At the end of the line it gives `null`.

Example 1: route("A")  ->  ["A", "B", "C"]
Example 2: route("C")  ->  ["C"]
