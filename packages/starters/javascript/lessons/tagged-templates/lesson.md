# Tagged Templates

## A tag gets the pieces

**Code**

```js
function inspect(strings, ...values) {
  console.log(JSON.stringify(strings));
  console.log(JSON.stringify(values));
  return "done";
}

const item = "tea";
const price = 4;
const result = inspect`One ${item} costs ${price} euros`;

console.log(result);
```

**Output**

```text
["One "," costs "," euros"]
["tea",4]
done
```

**Rule:** A **tag** is a function written right before a template literal, with no brackets. JavaScript calls it with an array of the fixed strings first, then the value of each `${}` as its own argument. What the tag returns is the result of the whole expression.

There is always one more string than values. A template that starts or ends with `${}` has an empty string `""` at that end.

The values are not turned into strings. `price` arrives as the number `4`.

**Common mistake:** calling a tag with brackets.

**Wrong**

```js
function shout(strings, ...values) {
  return strings[0] + values[0].toUpperCase() + strings[1];
}

const name = "ada";

console.log(shout«(`Hi ${name}!`)»);
```

**Error**

```text
TypeError: undefined is not an object (evaluating 'values[0].toUpperCase')
```

**Fix**

```js
function shout(strings, ...values) {
  return strings[0] + values[0].toUpperCase() + strings[1];
}

const name = "ada";

console.log(shout«`Hi ${name}!`»);
```

With brackets, the template literal is built first, and `shout` gets one finished string and no values. Without brackets, `shout` is a tag and gets the pieces.

<!-- task -->

## Building the result

**Code**

```js
function bold(strings, ...values) {
  let out = strings[0];

  values.forEach((value, i) => {
    out += `**${value}**` + strings[i + 1];
  });

  return out;
}

const user = "Ada";
const count = 3;

console.log(bold`${user} has ${count} new messages`);
```

**Output**

```text
**Ada** has **3** new messages
```

**Rule:** A tag usually builds the text again: the first string, then each value followed by the string after it. On the way, it can change the values and leave the fixed text alone.

This is how a tag escapes HTML. It changes `<` and `&` in the values, which may come from a user. It trusts the strings, which come from the code.

**Common mistake:** forgetting the last string.

**Wrong**

```js
function bold(strings, ...values) {
  let out = "";

  values.forEach((value, i) => {
    out += strings[i] + `**${value}**`;
  });

  return out;
}

console.log(bold`Total: ${5} items`);
```

**Output**

```text
Total: **5**
```

**Fix**

```js
function bold(strings, ...values) {
  let out = "";

  values.forEach((value, i) => {
    out += strings[i] + `**${value}**`;
  });

  return out «+ strings.at(-1)»;
}

console.log(bold`Total: ${5} items`);
```

There is one more string than values, so a loop over the values never reaches the last string. Add it at the end.

<!-- task -->

## Raw strings

**Code**

```js
function show(strings) {
  console.log(strings[0].length);
  console.log(strings.raw[0].length);
  console.log(strings.raw[0]);
}

show`a\tb`;
console.log(String.raw`C:\temp\new`);
console.log(String.raw`${1 + 1}\n${"x"}`);
```

**Output**

```text
3
4
a\tb
C:\temp\new
2\nx
```

```steps
String.raw`a\nb`.length => 4
`a\nb`.length => 3
String.raw`\t` === "\\t" => true
```

**Rule:** A tag gets each string in two forms. `strings[i]` is **cooked**: an escape such as `\t` has become the character it stands for. `strings.raw[i]` is **raw**: the exact text in the code, backslashes included. `String.raw` is a built-in tag that joins the raw strings and the values.

`String.raw` keeps the backslashes of the template only. A value is already a finished string when the tag gets it, so its escapes were turned into characters long before.

<!-- task -->

## Tags return anything

**Code**

```js
function sql(strings, ...values) {
  let text = strings[0];

  values.forEach((value, i) => {
    text += "$" + (i + 1) + strings[i + 1];
  });

  return { text, params: values };
}

const name = "Ada'; DROP TABLE users; --";
const query = sql`SELECT * FROM users WHERE name = ${name} AND age > ${30}`;

console.log(query.text);
console.log(JSON.stringify(query.params));
```

**Output**

```text
SELECT * FROM users WHERE name = $1 AND age > $2
["Ada'; DROP TABLE users; --",30]
```

**Rule:** A tag can return any value, not only a string. This query tag puts a placeholder such as `$1` where each value was, and returns the values apart from the text. A database fills in the placeholders as plain data, so a value can never run as code.

The `strings` array is frozen, and the same template passes the same array every time it runs. So a tag can keep work it did for one template and reuse it.

**Common mistake:** building a query with a plain template literal.

**Wrong**

```js
const name = "Ada'; DROP TABLE users; --";
const text = «`SELECT * FROM users WHERE name = '${name}'`»;

console.log(text);
```

**Output**

```text
SELECT * FROM users WHERE name = 'Ada'; DROP TABLE users; --'
```

**Fix**

```js
function sql(strings, ...values) {
  let text = strings[0];

  values.forEach((value, i) => {
    text += "$" + (i + 1) + strings[i + 1];
  });

  return { text, params: values };
}

const name = "Ada'; DROP TABLE users; --";
const query = «sql`SELECT * FROM users WHERE name = ${name}`»;

console.log(query.text);
```

The name was pasted into the text, and its quote closed the string early. The rest of the name became a second command. This attack is called **SQL injection**. With the tag, the name stays in `params` and never touches the text.

<!-- task -->

## Remember

- A tag is a function placed right before a template literal. It gets the array of strings, then one argument per value.
- There is always one more string than values. A template that starts or ends with `${}` has `""` at that end.
- `strings.raw` holds the text as it was written. `String.raw` joins the raw strings and the values.
- A tag can treat the values apart from the text, and can return any value.
