Write `withDefault(obj, fallback)`. It returns an object that works like `obj`, except for one thing: reading a string key that `obj` does not have gives `fallback`.

Writes go to `obj`. Symbol keys work as usual.

Example 1: withDefault({ a: 1 }, 0).b  ->  0
Example 2: withDefault({ a: 1 }, 0).a  ->  1
Example 3: String(withDefault({}, 0))  ->  "[object Object]"
