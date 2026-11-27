`mentions(text, name)` should return `true` when the text holds `@` followed by the name, and `false` when it does not.

The code below is wrong when the mention is at the very start, and when there is no mention at all. Fix it.

Example 1: mentions("thanks @ada", "ada")  ->  true
Example 2: mentions("@ada see this", "ada")  ->  true
Example 3: mentions("hello all", "ada")  ->  false
