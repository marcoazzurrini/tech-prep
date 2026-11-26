# Time Sheet (medium)

`timeSheet(entries, whole)` should return one line of text for each entry. Each entry has a `task` and a number of `hours`.

Hours are shown with one decimal. When `whole` is true, they are rounded to a whole number instead.

The code below throws. Fix it.

Example 1: timeSheet([{ task: "Design", hours: 2.5 }], false)  ->  ["Design: 2.5h"]
Example 2: timeSheet([{ task: "Design", hours: 2.5 }], true)  ->  ["Design: 3h"]
Example 3: timeSheet([], false)  ->  []
