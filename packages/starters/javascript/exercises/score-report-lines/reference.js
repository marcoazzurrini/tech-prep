export function makeBoard(title) {
  return {
    title,
    scores: {},
    add(player, points) {
      this.scores[player] = (this.scores[player] ?? 0) + points;
    },
    report() {
      const board = this;

      function line(player) {
        return `${board.title}: ${player} ${board.scores[player]}`;
      }

      return Object.keys(this.scores).map(line);
    },
  };
}
