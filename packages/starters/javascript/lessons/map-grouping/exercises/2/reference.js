export function whoLikes(likes) {
  const byFood = new Map();

  for (const [person, foods] of Object.entries(likes)) {
    for (const food of foods) {
      byFood.getOrInsert(food, []).push(person);
    }
  }

  return byFood;
}
