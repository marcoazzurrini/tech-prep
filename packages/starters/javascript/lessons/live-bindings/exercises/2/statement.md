Other files import `score` from this file to show it on screen. They call `addPoints` and `reset`, but `score` always reads 0.

Fix the file, so that `score` shows the points added since the last reset.

Example 1:
  reset()
  addPoints(5)
  addPoints(2)
  exports.score  ->  7

Note: a test reads `exports.score`, which is how another file sees the export.
