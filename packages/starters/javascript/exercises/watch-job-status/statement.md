# Watch a Job (medium)

Write `watchJob(check)`. `check()` returns a promise of a job's status, such as `"queued"` or `"running"`.

`watchJob` returns something that `for await` can loop over. Each time a value is asked for, call `check()` once and give the status it returns. Stop after the status `"done"` or `"failed"`, and give that status too.

Do not call `check()` until a value is asked for. If `check()` rejects, reject with its error.

Example 1: watchJob(check), with check() giving "queued", "running", "done"  ->  the loop gets those three
Example 2: watchJob(check), with check() giving "done"  ->  the loop gets only "done"
