const firstLongWord = (line) => {
  for (const word of line.split(" ")) {
    if (word.length > 4) {
      return word;
    }
  }

  return "-";
};

export function firstLongWords(lines) {
  const result = [];

  for (const line of lines) {
    result.push(firstLongWord(line));
  }

  return result;
}
