`readSetting(name)` loads a setting with `loadSetting(name)`. When the setting is missing, it should give `"off"`.

`loadSetting` rejects with an error whose message is `"missing"` or `"locked"`. The code below also turns the `"locked"` error into `"off"`. Fix it, so that every error other than `"missing"` still rejects.

Example 1: readSetting("theme")  ->  a promise of "dark"
Example 2: readSetting("volume")  ->  a promise of "off"
Example 3: readSetting("password")  ->  rejects with the "locked" error
