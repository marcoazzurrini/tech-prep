Write `makeTimer(label, seconds)`. It returns an object with the properties `label` and `seconds`, and a method `describe()`.

`describe()` returns the text `<label>: <seconds>s`. It reads the object's properties as they are at the time of the call.

Example 1: makeTimer("tea", 180).describe()  ->  "tea: 180s"
Example 2: makeTimer("tea", 180).seconds  ->  180
