export function makeQueue(people) {
  return {
    people,
    [Symbol.iterator]() {
      const people = this.people;
      let index = 0;

      return {
        next() {
          if (index === people.length) return { value: undefined, done: true };
          return { value: people[index++], done: false };
        },
      };
    },
  };
}
