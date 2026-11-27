# Groups

## Capturing groups

**Code**

```js
const due = "Due: 2025-03-14";
const parts = due.match(/(\d{4})-(\d\d)-(\d\d)/);

console.log(parts[0]);
console.log(parts[1]);
console.log(parts[2], parts[3]);
console.log(parts.length);
```

**Output**

```text
2025-03-14
2025
03 14
4
```

```steps
"hahaha!".match(/«(ha)»+/)[0] => "hahaha"
"ha".match(/(ha)«(!)?»/)[2] => undefined
"abc".match(/«([a-c])+»/)[1] => "c"
```

**Rule:** Parentheses make a group. A quantifier after a group repeats the whole group. A group also captures the text it matched. `match` without `g` returns the whole match at index `0`, then each group from index `1`, numbered by its opening parenthesis.

A group that took no part in the match gives `undefined`. A repeated group keeps only its last repetition.

**Common mistake:** reading groups from `match` with `g`.

**Wrong**

```js
const setting = "size=10; qty=2";

console.log(setting.match(/(\w+)=(\d+)/g)[2]);
```

**Output**

```text
undefined
```

**Fix**

```js
const setting = "size=10; qty=2";

console.log(setting.match(/(\w+)=(\d+)/«»)[2]);
```

With `g`, `match` returns only the whole matches, `["size=10", "qty=2"]`. The groups are lost. Without `g`, it returns the first match with its groups, so index `2` is `"10"`.

<!-- task -->

## Named groups and replace

**Code**

```js
const date = /(?<day>\d\d)\/(?<month>\d\d)\/(?<year>\d{4})/;
const { day, month, year } = "Paid on 14/03/2025".match(date).groups;

console.log(year, month, day);
console.log("14/03/2025".replace(date, "$<year>-$<month>-$<day>"));
console.log("Ada Lovelace".replace(/(\w+) (\w+)/, "$2, $1"));
```

**Output**

```text
2025 03 14
2025-03-14
Lovelace, Ada
```

**Rule:** `(?<name>...)` gives a group a name. `match` puts the named groups in its `groups` object. In the replacement text of `replace`, `$1` inserts what group 1 matched, and `$<name>` inserts a named group.

A named group still has a number. In `date`, `$1` would insert the day.

`"Ada".replace(/(z)?Ada/, "[$1]")` gives `"[]"`. A group that took no part inserts nothing.

<!-- task -->

## Alternation

**Code**

```js
const size = /^(?:small|medium|large)$/;

console.log(size.test("medium"));
console.log(size.test("mediums"));
console.log(/^small|large$/.test("smallest"));
console.log("Width: 40".match(/(?:size|width): (\d+)/i)[1]);
```

**Output**

```text
true
false
true
40
```

**Rule:** `|` means "or". It has the lowest priority of all, so it splits the whole pattern unless a group holds it. `(?:...)` is a non-capturing group: it groups without a number, and adds nothing to the result.

`/^small|large$/` means `^small` or `large$`. Any text that starts with `small` passes.

**Common mistake:** putting a short choice before a longer one.

**Wrong**

```js
const timer = { text: "Wait 5 min" };

console.log(timer.text.match(/\d+ (m|min)/)[1]);
```

**Output**

```text
m
```

**Fix**

```js
const timer = { text: "Wait 5 min" };

console.log(timer.text.match(/\d+ («min|m»)/)[1]);
```

The choices are tried from left to right. The first one that lets the whole pattern match wins, even when a longer one would fit. Put the longer choice first.

<!-- task -->

## Backreferences

**Code**

```js
const tag = /<(\w+)>.*?<\/\1>/;

console.log("<b>Sale</b> now".match(tag)[0]);
console.log(tag.test("<b>Sale</i>"));
console.log(/^(\w)\1$/i.test("Aa"));
console.log(/^(?<ch>\w)\k<ch>$/.test("zy"));
```

**Output**

```text
<b>Sale</b>
false
true
false
```

**Rule:** A backreference matches the same text a group matched earlier. `\1` refers to group 1, and `\k<name>` to a named group. It repeats the text, not the pattern.

With the flag `i`, the repeat may differ in case. In the pattern a backreference is `\1`, and in the replacement text of `replace` it is `$1`.

**Common mistake:** closing a quote with any quote.

**Wrong**

```js
const line = { text: `She said "it's fine" twice` };

console.log(line.text.match(/["'].*?["']/)[0]);
```

**Output**

```text
"it'
```

**Fix**

```js
const line = { text: `She said "it's fine" twice` };

console.log(line.text.match(/«(["'])».*?«\1»/)[0]);
```

`["']` at the end accepts either quote, so the apostrophe closed the match. `\1` accepts only the quote that opened it.

<!-- task -->

## Remember

- `(...)` groups part of a pattern and captures it. `match` without `g` gives the whole match at `0` and the groups from `1`.
- `(?<name>...)` names a group, and `match(...).groups` holds it. `(?:...)` groups without capturing.
- `|` has the lowest priority, and the first choice that works wins. Put it in a group to limit it.
- `\1` and `\k<name>` match the same text again. In `replace`, use `$1` and `$<name>`.
