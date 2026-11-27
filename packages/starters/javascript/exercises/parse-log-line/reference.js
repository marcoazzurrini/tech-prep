const LINE = /^\[(?<level>ERROR|WARN|INFO)\] (?<date>\d{4}-\d\d-\d\d) (?<message>.+)$/;

export function parseLogLine(line) {
  const found = line.match(LINE);

  if (found === null) {
    return null;
  }

  const { level, date, message } = found.groups;
  return { level, date, message };
}
