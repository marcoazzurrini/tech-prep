export function serveReport(stats) {
  return `${stats["first-serve"]}% in, ${stats["double-faults"]} double faults`;
}
