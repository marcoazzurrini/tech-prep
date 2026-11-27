# Overriding Methods

## Child methods win

**Code**

```js
class Report {
  header() {
    return "REPORT";
  }

  render(body) {
    return `${this.header()}: ${body}`;
  }
}

class AlertReport extends Report {
  header() {
    return "ALERT";
  }
}

const report = new Report();
const alert = new AlertReport();

console.log(report.render("ready"));
console.log(alert.render("disk full"));
```

**Output**

```text
REPORT: ready
ALERT: disk full
```

**Rule:** A method in a child class overrides the parent's method of the same name. When a parent method calls `this.header()`, it finds the child's version on the prototype chain.

`Report.prototype.header` is unchanged. Only `AlertReport` instances see the override.

<!-- task -->

## Parent constructor runs first

**Code**

```js
class Metric {
  unit = "ms";

  constructor() {
    console.log("in ctor:", this.unit, this.label());
  }

  label() {
    return "base";
  }
}

class MemoryMetric extends Metric {
  unit = "MB";

  label() {
    return "memory";
  }
}

const m = new MemoryMetric();
console.log("after:", m.unit);
```

**Output**

```text
in ctor: ms memory
after: MB
```

**Rule:** Prototype methods exist before construction starts, so the parent constructor calls the child's overridden method. Child class fields run only after `super()` finishes, so the parent constructor still sees the parent's field.

A getter lives on the prototype too, so the parent constructor sees a child's overridden getter.

**Common mistake:** reading a child class field inside a method that the parent constructor calls.

**Wrong**

```js
class Greeter {
  constructor() {
    this.message = this.prefix() + " world";
  }

  prefix() {
    return "Hi";
  }
}

class FormalGreeter extends Greeter {
  «word = "Hello";»

  prefix() {
    return this.word;
  }
}

console.log(new FormalGreeter().message);
```

**Output**

```text
undefined world
```

**Fix**

```js
class Greeter {
  constructor() {
    this.message = this.prefix() + " world";
  }

  prefix() {
    return "Hi";
  }
}

class FormalGreeter extends Greeter {
  prefix() {
    «return "Hello";»
  }
}

console.log(new FormalGreeter().message);
```

When `Greeter`'s constructor calls `this.prefix()`, `FormalGreeter`'s `word` field does not exist yet, so `this.word` is `undefined`. Return the value from the method or a getter instead of a field.

<!-- task -->

## Method or arrow field

**Code**

```js
class Base {
  describe() {
    return "base";
  }
}

class FieldChild extends Base {
  describe = () => "field";
}

class GrandChild extends FieldChild {
  describe() {
    return "grand";
  }
}

const g = new GrandChild();
console.log(g.describe());
console.log(Object.hasOwn(g, "describe"));
```

**Output**

```text
field
true
```

**Rule:** A class method goes on the prototype, where subclasses can override it. An arrow-function field creates an own property on the instance, which shadows any prototype method in subclasses.

`super.describe()` skips own properties, so it looks up the prototype method instead of an arrow field.

**Common mistake:** writing an arrow field on a class that subclasses need to override.

**Wrong**

```js
class Button {
  «click = () => "button";»
}

class SubmitButton extends Button {
  click() {
    return "submit";
  }
}

console.log(new SubmitButton().click());
```

**Output**

```text
button
```

**Fix**

```js
class Button {
  «click() { return "button"; }»
}

class SubmitButton extends Button {
  click() {
    return "submit";
  }
}

console.log(new SubmitButton().click());
```

`Button`'s arrow field puts an own `click` property on every `SubmitButton` instance, hiding `SubmitButton.prototype.click`. Use a normal method when subclasses should override it.

<!-- task -->

## Remember

- A child's method overrides the parent's method, even when the parent calls it through `this`.
- The parent constructor sees child prototype methods and getters, because they already exist on the prototype.
- Child class fields are installed after `super()` returns, so the parent constructor does not see them.
- An arrow-function field creates an own property that shadows prototype methods in subclasses.
