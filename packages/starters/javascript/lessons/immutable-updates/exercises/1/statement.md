A saved game looks like `{ player: { name: "Ada", level: 3, stats: { hp: 5, xp: 40 } }, inventory: ["key"] }`.

Write `levelUp(save)`. It returns a new saved game in which `player.level` is one higher and `player.stats.xp` is `0`. Everything else has the same value.

The function must not change `save`. The parts that do not change, such as `inventory`, are reused: the result holds the same array.

Example 1:
  levelUp({ player: { name: "Ada", level: 3, stats: { hp: 5, xp: 40 } }, inventory: ["key"] })
  ->  { player: { name: "Ada", level: 4, stats: { hp: 5, xp: 0 } }, inventory: ["key"] }
