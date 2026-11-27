Add an `async` method `unread()` to the class `Inbox`. It returns a promise of how many messages have `read: false`.

Example 1: new Inbox([{ read: false }, { read: true }]).unread()  ->  1
Example 2: new Inbox([]).unread()  ->  0
