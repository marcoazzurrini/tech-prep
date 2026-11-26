const oneDecimal = (hours) => `${hours.toFixed(1)}h`;
const rounded = (hours) => `${Math.round(hours)}h`;

export function timeSheet(entries, whole) {
  const format = whole ? rounded : oneDecimal;

  return entries.map((entry) => `${entry.task}: ${format(entry.hours)}`);
}
