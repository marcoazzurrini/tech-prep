# Limiting Concurrency

## Workers share an index

**Code**

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const makeTask = (name, ms) => async () => {
  console.log("start " + name);
  await sleep(ms);
  console.log("end " + name);
  return name;
};

async function runLimited(tasks, limit) {
  const results = [];
  let next = 0;

  async function worker() {
    while (next < tasks.length) {
      const i = next;
      next += 1;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

const tasks = [makeTask("a", 50), makeTask("b", 5), makeTask("c", 25)];
runLimited(tasks, 2).then((results) => console.log(results.join(",")));
```

**Output**

```text
start a
start b
end b
start c
end c
end a
a,b,c
```

**Rule:** To run at most `limit` tasks at once, start `limit` **workers**. A worker is a loop: take the next index, run that task, wait for it, then take the next. The workers share `next`, so each task runs once. Each result goes to its own index.

`c` started as soon as `b` ended, while `a` still ran. Batches would have made `c` wait for `a`.

A task is a function, not a promise. Calling the function starts the work.

**Common mistake:** moving to the next index after the `await`.

**Wrong**

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const makeTask = (name, ms) => async () => {
  console.log("start " + name);
  await sleep(ms);
  return name;
};

async function runLimited(tasks, limit) {
  let next = 0;

  async function worker() {
    while (next < tasks.length) {
      «await tasks[next]();»
      «next += 1;»
    }
  }

  await Promise.all(Array.from({ length: limit }, () => worker()));
}

runLimited([makeTask("a", 20), makeTask("b", 5)], 2);
```

**Output**

```text
start a
start a
start b
```

**Fix**

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const makeTask = (name, ms) => async () => {
  console.log("start " + name);
  await sleep(ms);
  return name;
};

async function runLimited(tasks, limit) {
  let next = 0;

  async function worker() {
    while (next < tasks.length) {
      «const i = next;»
      «next += 1;»
      «await tasks[i]();»
    }
  }

  await Promise.all(Array.from({ length: limit }, () => worker()));
}

runLimited([makeTask("a", 20), makeTask("b", 5)], 2);
```

**Output**

```text
start a
start b
```

Both workers read `next` while it was still `0`, so both started `a`. Take the index and move `next` on in the same step, before any `await`.

<!-- task -->

## When a task fails

**Code**

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const makeTask = (name, ms, fails) => async () => {
  console.log("start " + name);
  await sleep(ms);
  if (fails) {
    throw new Error(name + " broke");
  }
  console.log("end " + name);
  return name;
};

async function runLimited(tasks, limit) {
  const results = [];
  let next = 0;
  let failed = false;

  async function worker() {
    while (!failed && next < tasks.length) {
      const i = next;
      next += 1;
      try {
        results[i] = await tasks[i]();
      } catch (error) {
        failed = true;
        throw error;
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, () => worker()));
  return results;
}

const tasks = [makeTask("a", 30), makeTask("b", 5, true), makeTask("c", 5), makeTask("d", 5)];
runLimited(tasks, 2).catch((error) => console.log("failed: " + error.message));
```

**Output**

```text
start a
start b
failed: b broke
end a
```

**Rule:** A failed task rejects its worker, so `Promise.all` rejects with that error at once. The other workers do not stop by themselves. A shared `failed` flag tells them to take no new task. A task that has already started still runs to its end, as `a` did.

To keep going after a failure, catch each error inside the worker. Store `{ status, value }` or `{ status, reason }` for each task, as `Promise.allSettled` does.

**Common mistake:** letting the other workers carry on.

**Wrong**

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const makeTask = (name, ms, fails) => async () => {
  console.log("start " + name);
  await sleep(ms);
  if (fails) {
    throw new Error(name + " broke");
  }
  return name;
};

async function runLimited(tasks, limit) {
  const results = [];
  let next = 0;

  async function worker() {
    while («next < tasks.length») {
      const i = next;
      next += 1;
      results[i] = await tasks[i]();
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, () => worker()));
  return results;
}

const tasks = [makeTask("a", 30), makeTask("b", 5, true), makeTask("c", 5), makeTask("d", 5)];
runLimited(tasks, 2).catch((error) => console.log("failed: " + error.message));
```

**Output**

```text
start a
start b
failed: b broke
start c
start d
```

**Fix**

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const makeTask = (name, ms, fails) => async () => {
  console.log("start " + name);
  await sleep(ms);
  if (fails) {
    throw new Error(name + " broke");
  }
  return name;
};

async function runLimited(tasks, limit) {
  const results = [];
  let next = 0;
  «let failed = false;»

  async function worker() {
    while («!failed && next < tasks.length») {
      const i = next;
      next += 1;
      «try {
        results[i] = await tasks[i]();
      } catch (error) {
        failed = true;
        throw error;
      }»
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, () => worker()));
  return results;
}

const tasks = [makeTask("a", 30), makeTask("b", 5, true), makeTask("c", 5), makeTask("d", 5)];
runLimited(tasks, 2).catch((error) => console.log("failed: " + error.message));
```

**Output**

```text
start a
start b
failed: b broke
```

The caller had already been told that the run failed. Yet the worker of `a` went on to start `c` and `d`, and their results went nowhere.

<!-- task -->

## Queue tasks over time

**Code**

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const makeTask = (name, ms) => async () => {
  console.log("start " + name);
  await sleep(ms);
  console.log("end " + name);
  return name;
};

function createQueue(limit) {
  let running = 0;
  const waiting = [];

  function startNext() {
    if (running >= limit || waiting.length === 0) {
      return;
    }
    const { task, resolve, reject } = waiting.shift();
    running += 1;
    task()
      .then(resolve, reject)
      .finally(() => {
        running -= 1;
        startNext();
      });
  }

  return {
    add(task) {
      return new Promise((resolve, reject) => {
        waiting.push({ task, resolve, reject });
        startNext();
      });
    },
  };
}

const queue = createQueue(2);
queue.add(makeTask("a", 50));
queue.add(makeTask("b", 5));
queue.add(makeTask("c", 20)).then((name) => console.log("got " + name));
```

**Output**

```text
start a
start b
end b
start c
end c
got c
end a
```

**Rule:** A queue takes tasks at any time, not only at the start. `add(task)` puts the task in a waiting list and returns a promise of its result. `startNext` starts a waiting task while fewer than `limit` are running. Each task that ends frees its place and calls `startNext` again.

`finally` frees the place whether the task fulfilled or rejected.

**Common mistake:** starting tasks only in `add`.

**Wrong**

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const makeTask = (name, ms) => async () => {
  console.log("start " + name);
  await sleep(ms);
  console.log("end " + name);
  return name;
};

function createQueue(limit) {
  let running = 0;
  const waiting = [];

  function startNext() {
    if (running >= limit || waiting.length === 0) {
      return;
    }
    const { task, resolve, reject } = waiting.shift();
    running += 1;
    task()
      .then(resolve, reject)
      .finally(() => {
        running -= 1;
      });
  }

  return {
    add(task) {
      return new Promise((resolve, reject) => {
        waiting.push({ task, resolve, reject });
        «startNext();»
      });
    },
  };
}

const queue = createQueue(1);
queue.add(makeTask("a", 10));
queue.add(makeTask("b", 10));
```

**Output**

```text
start a
end a
```

**Fix**

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const makeTask = (name, ms) => async () => {
  console.log("start " + name);
  await sleep(ms);
  console.log("end " + name);
  return name;
};

function createQueue(limit) {
  let running = 0;
  const waiting = [];

  function startNext() {
    if (running >= limit || waiting.length === 0) {
      return;
    }
    const { task, resolve, reject } = waiting.shift();
    running += 1;
    task()
      .then(resolve, reject)
      .finally(() => {
        running -= 1;
        «startNext();»
      });
  }

  return {
    add(task) {
      return new Promise((resolve, reject) => {
        waiting.push({ task, resolve, reject });
        startNext();
      });
    },
  };
}

const queue = createQueue(1);
queue.add(makeTask("a", 10));
queue.add(makeTask("b", 10));
```

**Output**

```text
start a
end a
start b
end b
```

When `b` was added, `a` held the only place, so `b` waited. Nothing looked at the waiting list again, and `b` waited for ever. A task that ends must start the next one.

<!-- task -->

## Remember

- Start `limit` workers. Each one takes the next index, runs that task, and loops until none are left.
- Take the index and move it on before the `await`, so no two workers take the same task.
- On a failure, reject at once and set a flag, so the workers take no new task.
- A queue runs each task that `add` gives it. A task that ends frees its place and starts the next.
