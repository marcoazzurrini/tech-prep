export function helpLine(command) {
  const name = command.name || "anonymous";
  const line = `${name}(${command.length})`;

  return command.help === undefined ? line : `${line}: ${command.help}`;
}
