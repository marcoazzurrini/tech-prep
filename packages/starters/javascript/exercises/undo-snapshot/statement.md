# Undo Snapshots (medium)

An editor keeps a list of past states, so the user can undo. Write `takeSnapshot(state)`. It returns a copy of `state` that later changes to `state` can never reach, at any depth.

The state holds strings, numbers, booleans, `null`, arrays, plain objects, dates, maps and sets. A map keeps its keys, and its values are copied. When the state reaches one object from two places, the snapshot reaches one copy from both.

Example 1:
  const state = { title: "Draft", lines: ["Hi"] };
  const snap = takeSnapshot(state);
  state.lines.push("there");
  snap.lines  ->  ["Hi"]
Example 2:
  const state = { saved: new Date(0) };
  takeSnapshot(state).saved.getTime()  ->  0

Note: solve it without `structuredClone`.
