Print `true` when the deploy needs approval, and `false` when it does not.

A deploy needs approval when its `env` is `"prod"`, or when it changes more than 20 files. One of the two is enough. The number of files is under `files_changed`.
