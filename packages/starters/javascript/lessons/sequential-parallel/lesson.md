# One after Another, or Together

## One after another

**Code**

```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function wash(car, ms) {
  console.log("start " + car);
  await delay(ms);
  console.log("end " + car);
}

async function washAll() {
  for (const [car, ms] of [["red", 30], ["blue", 10]]) {
    await wash(car, ms);
  }
  console.log("all clean");
}

washAll();
```

**Output**

```text
start red
end red
start blue
end blue
all clean
```

**Rule:** `await` inside a loop waits for each step to finish before the next one starts. The work runs **one after another**, so the total time is the sum of all the steps.

The blue car is quicker, but it still waited for the red one.

Use this when a step needs the result of the step before it.

`forEach` with an `async` callback does not wait at all. Use `for...of`, as the lesson on `await` showed.

<!-- task -->

## Start first, then wait

**Code**

```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function wash(car, ms) {
  console.log("start " + car);
  await delay(ms);
  console.log("end " + car);
  return car;
}

async function washBoth() {
  const red = wash("red", 30);
  const blue = wash("blue", 10);
  console.log("both started");

  const cars = await Promise.all([red, blue]);
  console.log(cars.join(" and ") + " are clean");
}

washBoth();
```

**Output**

```text
start red
start blue
both started
end blue
end red
red and blue are clean
```

**Rule:** Calling an `async` function starts its work at once. `await` starts nothing. It only waits. So start every piece of work that does not depend on another first, then wait for all of them. They run **together**.

`await red` and then `await blue` would also wait for both. But if `blue` rejects while the function still waits for `red`, nothing handles `blue` yet. Bun and Node report an unhandled rejection. `Promise.all` handles every promise at once.

**Common mistake:** awaiting each call where you make it.

**Wrong**

```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function wash(car, ms) {
  console.log("start " + car);
  await delay(ms);
  console.log("end " + car);
  return car;
}

async function washBoth() {
  const red = «await» wash("red", 30);
  const blue = «await» wash("blue", 10);
  console.log(red + " and " + blue + " are clean");
}

washBoth();
```

**Output**

```text
start red
end red
start blue
end blue
red and blue are clean
```

**Fix**

```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function wash(car, ms) {
  console.log("start " + car);
  await delay(ms);
  console.log("end " + car);
  return car;
}

async function washBoth() {
  «const [red, blue] = await Promise.all([wash("red", 30), wash("blue", 10)]);»
  console.log(red + " and " + blue + " are clean");
}

washBoth();
```

The first `await` held the function, so the blue car did not even start until the red one was done.

<!-- task -->

## map, then Promise.all

**Code**

```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function upload(file) {
  console.log("upload " + file.name);
  await delay(file.ms);
  return file.name + " ok";
}

async function uploadAll(files) {
  const results = await Promise.all(files.map((file) => upload(file)));
  console.log(results.join(", "));
}

uploadAll([{ name: "a.png", ms: 30 }, { name: "b.png", ms: 10 }]);
```

**Output**

```text
upload a.png
upload b.png
a.png ok, b.png ok
```

**Rule:** `list.map((item) => work(item))` calls `work` for every item straight away, and gives an array of promises. `await Promise.all` on that array waits for all of them. The results come in the order of the list.

An `async` callback can hold several steps: `files.map(async (file) => { const data = await read(file); return save(data); })`. Each file runs its own steps in order, and the files run together.

**Common mistake:** a callback with braces and no `return`.

**Wrong**

```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function upload(file) {
  console.log("upload " + file.name);
  await delay(file.ms);
  return file.name + " ok";
}

async function uploadAll(files) {
  const results = await Promise.all(files.map((file) => «{ upload(file); }»));
  console.log("first: " + results[0]);
}

uploadAll([{ name: "a.png", ms: 30 }, { name: "b.png", ms: 10 }]);
```

**Output**

```text
upload a.png
upload b.png
first: undefined
```

**Fix**

```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function upload(file) {
  console.log("upload " + file.name);
  await delay(file.ms);
  return file.name + " ok";
}

async function uploadAll(files) {
  const results = await Promise.all(files.map((file) => «upload(file)»));
  console.log("first: " + results[0]);
}

uploadAll([{ name: "a.png", ms: 30 }, { name: "b.png", ms: 10 }]);
```

The uploads started, but `map` gave `[undefined, undefined]`. `Promise.all` had nothing to wait for, so it went on at once.

<!-- task -->

## Run in batches

**Code**

```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const times = { ana: 40, ben: 10, cy: 20 };

async function send(name) {
  await delay(times[name]);
  console.log("sent to " + name);
}

async function sendAll(names, size) {
  for (let i = 0; i < names.length; i += size) {
    const batch = names.slice(i, i + size);
    await Promise.all(batch.map((name) => send(name)));
    console.log("batch done");
  }
}

sendAll(["ana", "ben", "cy"], 2);
```

**Output**

```text
sent to ben
sent to ana
batch done
sent to cy
batch done
```

**Rule:** To run at most `size` at once, split the list into **batches** of `size`. Run each batch together with `Promise.all`, and await it before the next batch starts.

This mixes both ways. The items of a batch run together, and the batches run one after another.

A batch is as slow as its slowest item. `cy` could have started when `ben` finished, but it waited for `ana`. A later lesson keeps `size` tasks running at all times.

<!-- task -->

## Remember

- `await` in a loop runs the work one after another. Use it when each step needs the one before.
- An `async` call starts at once, and `await` only waits. Start everything first, then `await Promise.all`.
- `await Promise.all(list.map((item) => work(item)))` runs the whole list together, with results in list order.
- In batches, each batch runs together, and the next batch waits for the whole of the one before.
