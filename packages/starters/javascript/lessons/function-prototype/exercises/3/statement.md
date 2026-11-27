`copyWithTitle(item, title)` makes a new object of the same kind as `item`, with another title.

For a track, it gives back an object that is not a track at all. Fix the code so that the copy of a track is a track.

Example 1: copyWithTitle(new Track("A"), "B").label()  ->  "Track: B"
Example 2: new Track("A").constructor === Track  ->  true
