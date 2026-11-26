export function levelUp(save) {
  const { player } = save;

  return {
    ...save,
    player: {
      ...player,
      level: player.level + 1,
      stats: { ...player.stats, xp: 0 },
    },
  };
}
