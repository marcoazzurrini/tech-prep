# Menu Paths (medium)

A menu is an array of entries. Each entry has a `label`. An entry may also have `items`: an array of entries that open under it, to any depth.

Write `menuPaths(menu)`. It returns the path of every entry that has no `items`, in the order the menu shows them. A path is the labels from the top down to the entry, joined with `" > "`.

An entry with an empty `items` array gives no path.

Example 1:
  menuPaths([{ label: "File", items: [{ label: "New" }, { label: "Open" }] }, { label: "Help" }])
  ->  ["File > New", "File > Open", "Help"]
Example 2: menuPaths([])  ->  []
