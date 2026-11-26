export function createTeam(name) {
  return {
    name,
    members: [],
    join(person) {
      this.members.push(person);
    },
    badges() {
      return this.members.map((person) => `${person} (${this.name})`);
    },
  };
}
