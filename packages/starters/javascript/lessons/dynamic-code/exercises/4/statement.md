`calculate(a, op, b)` should work out `a op b` for the operators `+`, `-`, `*` and `/`. For any other `op`, it returns `null`.

The code below runs `op` as code. So it also runs operators it should refuse, and any other code at all. Fix it.

Example 1: calculate(6, "*", 7)  ->  42
Example 2: calculate(2, "^", 3)  ->  null
Example 3: calculate(2, "; 99;", 3)  ->  null
