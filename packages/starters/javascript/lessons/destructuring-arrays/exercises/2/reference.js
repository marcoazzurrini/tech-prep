export function parseCommand(words) {
  const [name = "help", ...args] = words;

  return { name, args };
}
