A widget looks like `{ label: "Save", size: { w: 2, h: 1 }, onClick() {} }`. Each of its properties holds either data or a function.

Write `cloneWidget(widget)`. It returns a new widget with the same keys. A property that holds a function keeps that same function. Every other value is deep copied.

The function must not change `widget`.

Example 1:
  const size = { w: 2, h: 1 };
  const onClick = () => "saved";
  const copy = cloneWidget({ label: "Save", size, onClick });
  copy.size  ->  { w: 2, h: 1 }
  copy.size === size  ->  false
  copy.onClick === onClick  ->  true
