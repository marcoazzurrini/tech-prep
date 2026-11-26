export function countVotes(votes) {
  const tally = {
    counts: {},
    add(name) {
      this.counts[name] = (this.counts[name] ?? 0) + 1;
    },
    winner() {
      let best = null;

      for (const name of Object.keys(this.counts)) {
        if (best === null || this.counts[name] > this.counts[best]) {
          best = name;
        }
      }

      return best;
    },
  };

  votes.forEach((name) => tally.add(name));

  return tally.winner();
}
