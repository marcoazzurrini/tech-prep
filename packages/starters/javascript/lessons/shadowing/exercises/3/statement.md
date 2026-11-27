Every note is made with `Object.create(note)`. `addTag(tag)` should add a tag to the note it is called on, and return how many tags that note has.

The code below adds every tag to all the notes at once. Fix `addTag`.

Example 1: a.addTag("work")  ->  1, and b.tags is still []
Example 2: a.addTag("x"), then a.addTag("y")  ->  2
