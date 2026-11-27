`Player` is written for you. Make `Keeper` a child class of `Player`.

Give `Keeper` one method of its own, `save()`. It adds 2 points with the inherited `score` method, and returns the new total.

Example 1:
  const keeper = new Keeper("Ana");
  keeper.score(3)  ->  3
  keeper.save()  ->  5
  keeper instanceof Player  ->  true
