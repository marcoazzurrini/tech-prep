export function splitWords(command) {
  const word = /\s*(?:"([^"]*)"|([^\s"]+))\s*/y;
  const words = [];

  while (word.lastIndex < command.length) {
    const start = word.lastIndex;
    const match = word.exec(command);

    if (match === null) {
      if (command.slice(start).trim() === "") {
        break;
      }

      throw new SyntaxError(`Unclosed quote at ${command.indexOf('"', start)}`);
    }

    words.push(match[1] ?? match[2]);
  }

  return words;
}
