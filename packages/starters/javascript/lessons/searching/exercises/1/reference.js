export function isWaiting(tickets, id) {
  return tickets.findIndex((ticket) => ticket.id === id) !== -1;
}
