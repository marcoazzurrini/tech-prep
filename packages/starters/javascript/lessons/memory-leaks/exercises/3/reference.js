export function createSessions() {
  const open = new Map();
  let nextId = 1;

  return {
    open(user) {
      const id = nextId++;
      open.set(id, { id, user });
      return id;
    },
    close(id) {
      open.delete(id);
    },
    activeUsers() {
      return [...open.values()].map((s) => s.user);
    },
    stored() {
      return open.size;
    },
  };
}
