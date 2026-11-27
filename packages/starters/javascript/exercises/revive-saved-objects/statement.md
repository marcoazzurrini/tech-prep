# Revive Saved Objects (medium)

Objects saved as JSON lose their class. Write `revive(text, classes)` to bring them back.

`text` is JSON. Any object in it shaped like `{ "type": "Point", "data": { "x": 1 } }` is a saved object. `classes` maps each type name to its class. Replace each saved object with an object linked to that class's `prototype`, so its methods work, with the fields of `data` as its own properties. Saved objects can be nested inside `data`, and every other value stays as it is.

Do not run the constructors. They may have side effects, such as counting instances.

Example 1: revive('{"type":"Point","data":{"x":1,"y":2}}', { Point })  ->  a Point with x = 1 and y = 2
Example 2: revive('[1, "a"]', {})  ->  [1, "a"]
