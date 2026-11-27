export class Playlist {
  constructor(name) {
    this.name = name;
    this.songs = [];
  }

  add(song) {
    this.songs.push(song);
  }

  count() {
    return this.songs.length;
  }
}
