# Help Line (easy)

A command-line tool keeps each command as a function. Write `helpLine(command)`. It returns one line of help for the command: its name, then its number of parameters in parentheses.

A command may have a `help` property, a string. When it has one, add `": "` and the help text. A command with no name is called `anonymous`.

Example 1:
  function add(a, b) {}
  add.help = "Adds two numbers";
  helpLine(add)  ->  "add(2): Adds two numbers"
Example 2:
  const ping = () => "pong";
  helpLine(ping)  ->  "ping(0)"
Example 3: helpLine(() => {})  ->  "anonymous(0)"
