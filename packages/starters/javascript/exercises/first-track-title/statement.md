# First Track (easy)

Write `firstTrackTitle(album)`. It returns the title of the album's first track, in upper case.

Return `null` when there is no such title. The `album` may be `null`. Its `tracks` array may be missing or empty. A track may have no `title`.

Example 1: firstTrackTitle({ tracks: [{ title: "Intro" }, { title: "Rain" }] })  ->  "INTRO"
Example 2: firstTrackTitle({ tracks: [] })  ->  null
Example 3: firstTrackTitle({ name: "Demo" })  ->  null
Example 4: firstTrackTitle(null)  ->  null
