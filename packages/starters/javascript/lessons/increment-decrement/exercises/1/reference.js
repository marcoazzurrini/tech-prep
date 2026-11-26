export function numberLines(lines) {
  const result = [];
  let n = 0;

  for (const line of lines) {
    result.push(`${++n}. ${line}`);
  }

  return result;
}
