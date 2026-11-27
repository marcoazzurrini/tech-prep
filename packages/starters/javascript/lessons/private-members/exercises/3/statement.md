`Money` keeps an amount of cents in a private field.

`equals(other)` should return `true` only when `other` is a `Money` with the same cents. `Money.isMoney(value)` should return `true` only for a `Money`. Both must return `false` for any other value, including a plain object, a number and `null`. Neither may throw.

The code below throws for those values. Fix it.

Example 1: new Money(250).equals(new Money(250))  ->  true
Example 2: new Money(250).equals({ cents: 250 })  ->  false
Example 3: Money.isMoney(5)  ->  false
