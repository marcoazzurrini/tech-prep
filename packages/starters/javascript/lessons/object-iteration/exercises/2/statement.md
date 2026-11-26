Write `lowerCaseKeys(headers)`. It returns a new object with the same values, and every key in lower case.

Leave the values as they are. When two keys become the same, the later one wins.

Example 1: lowerCaseKeys({ "Content-Type": "text/html", ETag: "abc" })  ->  { "content-type": "text/html", etag: "abc" }
Example 2: lowerCaseKeys({})  ->  {}
