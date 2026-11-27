`getPage(n)` gives a promise of the names on page `n`. Pages count from 0. An empty page means there are no more pages.

Write `allNames(getPage)`, an async generator function. It yields every name, page after page.

Load a page only when every name before it has been asked for.

Example 1: allNames(getPage), with pages [["a", "b"], ["c"]]  ->  yields "a", "b", "c"
Example 2: allNames(getPage), with an empty first page  ->  yields nothing
