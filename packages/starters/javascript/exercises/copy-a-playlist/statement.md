# Copy a Playlist (easy)

A playlist looks like `{ name: "Road trip", songs: [song, song] }`. Each song is an object.

Write `copyPlaylist(playlist)`. It returns a new playlist with `" (copy)"` added to the name. Every other property keeps its value. The copy has its own `songs` array, so adding a song to one playlist does not add it to the other.

The song objects are not copied. Both playlists hold the same ones. The function must not change `playlist`.

Example 1:
  const first = { title: "Low", plays: 2 };
  const mine = { name: "Road trip", songs: [first] };
  const yours = copyPlaylist(mine);
  yours.name  ->  "Road trip (copy)"
  yours.songs === mine.songs  ->  false
  yours.songs[0] === first  ->  true
