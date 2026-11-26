A user's rights are flags in one number, `access`. Write three functions. In each, `flag` is a number with one bit set, such as 1, 2 or 4.

- `grant(access, flag)` returns `access` with the flag set.
- `revoke(access, flag)` returns `access` with the flag cleared.
- `has(access, flag)` returns `true` when the flag is set, and `false` when it is not.

Example 1: grant(1, 4)  ->  5
Example 2: revoke(7, 2)  ->  5
Example 3: has(5, 4)  ->  true
Example 4: has(5, 2)  ->  false
