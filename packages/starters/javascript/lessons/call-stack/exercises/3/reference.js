export function stackTrace(events) {
  const stack = [];

  for (const event of events) {
    if (event === "return") {
      stack.pop();
    } else {
      stack.push(event);
    }
  }

  return stack.toReversed();
}
