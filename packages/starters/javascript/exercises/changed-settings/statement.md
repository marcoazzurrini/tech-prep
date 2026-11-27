# Changed Settings (medium)

Settings come in layers. Each layer is made with `Object.create(lower)`, and holds only the settings it sets itself. A setting it does not set is read from the layers below.

Write `changedSettings(layer)`. It returns a plain object with the settings this layer sets to a value different from the one the layers below would give.

Example 1: a layer over { theme: "dark", size: 14 } that sets theme = "light" and size = 14  ->  { theme: "light" }
Example 2: a layer over { a: 1 } that sets b = 2  ->  { b: 2 }
Example 3: a layer over { a: 1 } that sets nothing  ->  {}
