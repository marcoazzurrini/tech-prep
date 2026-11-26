export function createTv() {
  return {
    volume: 5,
    volumeUp() {
      this.volume += 1;

      return this.volume;
    },
    setVolume(level) {
      this.volume = level;

      return this.volume;
    },
  };
}

export function createRemote(tv) {
  return {
    louder: tv.volumeUp.bind(tv),
    mute: tv.setVolume.bind(tv, 0),
  };
}
