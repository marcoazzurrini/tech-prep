Write `numberAll(...lists)`. It takes any number of arrays of names. It returns one array with every name, list after list, each with its place in front.

Join the lists with `Iterator.concat`. Then pair the names with an endless counter, using `Iterator.zip`.

Example 1: numberAll(["Ada", "Bo"], ["Cy"])  ->  ["1. Ada", "2. Bo", "3. Cy"]
Example 2: numberAll([], ["Dee"])  ->  ["1. Dee"]
Example 3: numberAll()  ->  []
