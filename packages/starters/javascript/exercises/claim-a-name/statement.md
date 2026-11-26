# Claim a Name (easy)

Write `claim(name, value)`. It makes `value` readable everywhere in the program under the bare name `name`, but only when the name is free. A name is free when reading it from the global object gives `undefined`.

It returns `true` when it claimed the name. When the name is taken, it changes nothing and returns `false`.

Example 1: claim("shopTheme", "dark")  ->  true, and now `shopTheme` is "dark"
Example 2: claim("encodeURI", 1)  ->  false, and `encodeURI` is still a function
