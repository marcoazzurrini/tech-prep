`loadPage(getUser, getNews)` should give a promise of `{ user, news }`. Each argument is a function that returns a promise.

The user and the news do not depend on each other, but the code below waits for the user before it even asks for the news. Make it start both at once.

Example 1: loadPage(async () => "ana", async () => ["rain"])  ->  { user: "ana", news: ["rain"] }
