# Load with Backup (medium)

Write `loadWithBackup(primary, backup)`. Both arguments are functions that return a promise.

Call `primary` and give its value. If it fails, call `backup` and give its value instead. Call `backup` only when it is needed. If both fail, reject with `new Error("both failed")`, with the backup's error as its `cause`.

A function that throws when it is called has failed too.

Example 1: loadWithBackup(async () => "main", async () => "spare")  ->  "main"
Example 2: loadWithBackup(async () => { throw new Error("down"); }, async () => "spare")  ->  "spare"
