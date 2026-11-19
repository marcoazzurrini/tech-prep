export function mutualFriends(
  n: number,
  friendships: number[][],
  a: number,
  b: number
): number[] {
  // Adjacency list: friends[p] holds every friend of person p.
  const friends: number[][] = Array.from({ length: n }, () => []);
  for (const [x, y] of friendships) {
    friends[x!]!.push(y!);
    friends[y!]!.push(x!);
  }
  // Keep the people who are in both lists.
  const friendsOfB = new Set(friends[b]);
  return friends[a]!.filter((p) => friendsOfB.has(p)).sort((p, q) => p - q);
}
