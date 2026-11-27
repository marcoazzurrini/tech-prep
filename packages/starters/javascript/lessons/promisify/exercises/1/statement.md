`bake(dish, onDone, onBurnt)` takes two callbacks. Later it calls `onDone(text)` on success, or `onBurnt(error)` on failure.

Write `bakeAsync(dish)`. It returns a promise that fulfils with the text, or rejects with the error.

Example 1: bakeAsync("bread")  ->  fulfils with "bread baked"
Example 2: bakeAsync("toast")  ->  rejects with an error whose message is "toast burnt"
