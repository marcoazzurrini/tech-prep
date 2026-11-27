export class Grid {
  constructor(rows) {
    this.rows = rows;
  }

  *[Symbol.iterator]() {
    for (const row of this.rows) {
      yield* row;
    }
  }
}
