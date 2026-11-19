Print one CSV line for each task: its `id`, its `title` and its `done` value, in that order.

Use the `-r` flag, so that jq prints plain text. The command below stops with an error, because it gives `@csv` an object. Add the step that builds a row from each task.
