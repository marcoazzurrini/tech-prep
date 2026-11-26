`capScores(scores, max)` should change the array it is given: every score above `max` becomes `max`. It returns nothing.

The code below leaves the caller's array as it was. Fix it.

Example 1:
  const scores = [5, 12, 9];
  capScores(scores, 10);
  scores  ->  [5, 10, 9]
