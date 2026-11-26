`tagLine(label, tags)` should return the label, a colon and the tags, with a comma and a space between two tags.

The code below leaves out the space after each comma. Fix it.

Example 1: tagLine("Tags", ["js", "ts", "css"])  ->  "Tags: js, ts, css"
Example 2: tagLine("One", ["solo"])  ->  "One: solo"
Example 3: tagLine("None", [])  ->  "None: "
