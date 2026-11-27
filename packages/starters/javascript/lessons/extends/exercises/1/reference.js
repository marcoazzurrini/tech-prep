export class Player {
  constructor(name) {
    this.name = name;
    this.points = 0;
  }

  score(points) {
    this.points += points;

    return this.points;
  }
}

export class Keeper extends Player {
  save() {
    return this.score(2);
  }
}
