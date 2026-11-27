Write `whoLikes(likes)`. It takes an object that maps each person to the foods they like. It returns a `Map` from each food to the people who like it.

List the foods in the order they first appear, and the people in the order of the object.

Example 1: [...whoLikes({ ada: ["tea", "jam"], bo: ["jam"] })]  ->  [["tea", ["ada"]], ["jam", ["ada", "bo"]]]
Example 2: [...whoLikes({})]  ->  []
