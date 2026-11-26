Write `parseCommand(words)`. It takes an array of words. The first word is the name of a command, and the other words are its arguments.

Return `{ name, args }`. When there is no first word, the name is `"help"`.

Example 1: parseCommand(["move", "3", "north"])  ->  { name: "move", args: ["3", "north"] }
Example 2: parseCommand(["quit"])  ->  { name: "quit", args: [] }
Example 3: parseCommand([])  ->  { name: "help", args: [] }
