Write a class `Playlist`. `new Playlist(name)` makes a playlist with two properties: `name`, and `songs`, an empty array.

- `add(song)` puts a song title at the end of `songs`.
- `count()` returns how many songs there are.

Example 1:
  const road = new Playlist("Road");
  road.add("Intro");
  road.count()  ->  1
  road.songs  ->  ["Intro"]
