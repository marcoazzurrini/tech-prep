export function inboxLabel(name, count) {
  const amount = count === 0 ? "no" : count;
  const noun = count === 1 ? "message" : "messages";

  return `${name}, you have ${amount} new ${noun}`;
}
