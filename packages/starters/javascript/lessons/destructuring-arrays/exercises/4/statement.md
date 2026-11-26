`firstWinner(result)` should return the first name in `result.winners`. It should return `"nobody"` when the list is empty, is `null` or is missing.

The code below throws when there is no list. Fix it.

Example 1: firstWinner({ winners: ["Ada", "Ben"] })  ->  "Ada"
Example 2: firstWinner({ winners: [] })  ->  "nobody"
Example 3: firstWinner({})  ->  "nobody"
