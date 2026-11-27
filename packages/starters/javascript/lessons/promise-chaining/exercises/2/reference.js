const users = {
  1: { name: "Ada", cityId: 10 },
  2: { name: "Bo", cityId: 20 },
  3: { name: "Cy", cityId: 30 },
  4: { name: "Di", cityId: 10 },
  5: { name: "Ed", cityId: 20 },
};

const cities = { 10: "Lyon", 20: "Oslo", 30: "Porto" };

function later(value, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function findUser(id) {
  return later(users[id], 10);
}

export function findCity(cityId) {
  return later(cities[cityId], 10);
}

export function cityOf(userId) {
  return findUser(userId).then((user) => findCity(user.cityId));
}
