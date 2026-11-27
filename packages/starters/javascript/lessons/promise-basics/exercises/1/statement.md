Write `checkAge(age)`. It returns a promise. The promise is fulfilled with `"welcome"` when `age` is 18 or more. Otherwise it is rejected with an `Error` whose message is `"too young"`.

Example 1: checkAge(20)  ->  a promise fulfilled with "welcome"
Example 2: checkAge(12)  ->  a promise rejected with Error("too young")
