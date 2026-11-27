export function sharedFreeHours(calendars) {
  if (calendars.length === 0) {
    return [];
  }

  let shared = new Set(calendars[0]);

  for (const hours of calendars.slice(1)) {
    shared = shared.intersection(new Set(hours));
  }

  return [...shared].sort((a, b) => a - b);
}
