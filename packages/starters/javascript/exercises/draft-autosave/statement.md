# Draft Autosave (medium)

A text editor saves the draft while the user types. Saving after every key is too much.

Write `autosave(save, ms)`. It returns an object with two methods:

- `edit(text)` records a new version of the draft. Do not save at once. Call `save(text)` once the edits stop: `ms` milliseconds after the last edit, with the text of that edit.
- `discard()` drops an edit that is waiting to be saved.

The file also exports `wait(ms)`, for the tests.

Example 1:
  const draft = autosave(save, 20);
  draft.edit("H"); draft.edit("Hi")
  calls save("Hi") once, 20 ms after the second edit
Example 2:
  draft.edit("oops"); draft.discard()
  never calls save
