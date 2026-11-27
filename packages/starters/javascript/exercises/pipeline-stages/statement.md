# Text Pipeline Stages (medium)

Write `class TextStage`, `class TrimStage extends TextStage`, and `class ShoutStage extends TrimStage`.

`TextStage` tracks how many times `run(text)` has been called on that instance in a private field, exposed through a getter `runs` (starting at `0`). Its `transform(text)` returns `text` unchanged, and `run(text)` increments the count and returns `this.transform(text)`.

`TrimStage` trims leading and trailing spaces in `transform(text)`. `ShoutStage` trims leading and trailing spaces and converts the result to uppercase in `transform(text)`. Neither subclass defines its own `run`.

Example 1:
  const s = new TrimStage();
  s.run("  hello  ")  ->  "hello"
  s.runs  ->  1

Example 2:
  const s = new ShoutStage();
  s.run("  hi  ")  ->  "HI"
  s.run("ok")  ->  "OK"
  s.runs  ->  2
