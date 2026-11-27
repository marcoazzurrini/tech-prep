export class Scoreboard {
  points = 0;

  award = (amount) => {
    this.points += amount;

    return this.points;
  };
}
