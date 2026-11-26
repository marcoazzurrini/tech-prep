export function createQuery(table) {
  return {
    conditions: [],
    column: null,
    count: null,
    where(condition) {
      this.conditions.push(condition);

      return this;
    },
    orderBy(column) {
      this.column = column;

      return this;
    },
    limit(count) {
      this.count = count;

      return this;
    },
    toString() {
      let text = `SELECT * FROM ${table}`;

      if (this.conditions.length > 0) {
        text += ` WHERE ${this.conditions.join(" AND ")}`;
      }

      if (this.column !== null) {
        text += ` ORDER BY ${this.column}`;
      }

      if (this.count !== null) {
        text += ` LIMIT ${this.count}`;
      }

      return text;
    },
  };
}
