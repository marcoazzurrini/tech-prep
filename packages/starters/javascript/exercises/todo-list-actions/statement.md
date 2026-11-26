# Todo List Actions (medium)

The state of a todo app looks like `{ filter: "all", todos: [{ id: 1, text: "Tea", done: false }] }`.

Write `applyAction(state, action)`. It returns the state after the action:

- `{ type: "add", id, text }` adds a todo at the end. It is not done.
- `{ type: "toggle", id }` flips `done` on the todo with that `id`.
- `{ type: "remove", id }` takes out the todo with that `id`.
- `{ type: "filter", value }` sets `filter` to `value`.
- Any other action returns `state` itself.

The app keeps old states to undo with, and compares parts of two states with `===` to see what changed. So `state` and everything in it must stay as it was. A part that an action does not change must be the same object in the new state.

Example 1:
  applyAction({ filter: "all", todos: [] }, { type: "add", id: 1, text: "Tea" })
  ->  { filter: "all", todos: [{ id: 1, text: "Tea", done: false }] }
