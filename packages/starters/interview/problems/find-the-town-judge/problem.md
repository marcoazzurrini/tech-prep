# Find the Town Judge (easy)

A town has `n` people, labelled `1` to `n`. One of them may be the judge.

- The judge trusts nobody.
- Every other person trusts the judge.

Each pair `[a, b]` in `trust` means person `a` trusts person `b`. Return the label of the judge. Return `-1` if there is no judge.

Example 1: n = 2, trust = [[1, 2]]  ->  2
Example 2: n = 3, trust = [[1, 3], [2, 3]]  ->  3
Example 3: n = 3, trust = [[1, 3], [2, 3], [3, 1]]  ->  -1  (person 3 trusts someone)

Constraints: 1 <= n <= 1000, 0 <= trust.length <= 10^4, all pairs are distinct, a != b.
