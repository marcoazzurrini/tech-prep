export function Ticket(film) {
  if (!new.target) {
    return new Ticket(film);
  }

  this.film = film;
}
