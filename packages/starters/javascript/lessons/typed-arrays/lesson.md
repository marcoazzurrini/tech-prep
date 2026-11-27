# Typed Arrays

## Bytes and views

**Code**

```js
const buffer = new ArrayBuffer(4);
const bytes = new Uint8Array(buffer);

bytes[0] = 200;
bytes[3] = 7;
bytes[9] = 1;

console.log(buffer.byteLength);
console.log(bytes.length);
console.log(bytes.join(","));
console.log(bytes[9]);
```

**Output**

```text
4
4
200,0,0,7
undefined
```

**Rule:** An `ArrayBuffer` is a block of raw bytes, all `0` at the start. You cannot read it directly. A typed array such as `Uint8Array` is a view on it. It reads and writes the bytes as numbers of one type. Its length is fixed.

`new Uint8Array(3)` makes its own buffer of three zero bytes. `Uint8Array.from([5, 6])` copies the numbers of an array.

`bytes[9] = 1` writes past the end, and is ignored without an error, even in strict mode.

**Common mistake:** adding an item with `push`.

**Wrong**

```js
const bytes = new Uint8Array(2);
bytes.«push(5)»;

console.log(bytes.join(","));
```

**Error**

```text
TypeError: bytes.push is not a function. (In 'bytes.push(5)', 'bytes.push' is undefined)
```

**Fix**

```js
const bytes = new Uint8Array(2);
«bytes[0] = 5»;

console.log(bytes.join(","));
```

A typed array cannot grow or shrink, so it has no `push`, `pop` or `splice`. It has most other array methods, such as `map`, `join`, `slice` and `indexOf`. Write to an index, or make a longer typed array.

<!-- task -->

## Wrapping and clamping

**Code**

```js
const u8 = new Uint8Array([255, 256, 300, -1, 3.9]);
const i8 = new Int8Array([127, 128, 200, -129]);
const clamped = new Uint8ClampedArray([300, -5, 3.9, 2.5]);

console.log(u8.join(","));
console.log(i8.join(","));
console.log(clamped.join(","));
```

**Output**

```text
255,0,44,255,3
127,-128,-56,127
255,0,4,2
```

```steps
new Uint8Array([«256»])[0] => 0
new Uint8Array([«-1»])[0] => 255
new Int8Array([«128»])[0] => -128
new Uint8Array([«3.9»])[0] => 3
```

**Rule:** Each type holds a fixed range: `Uint8Array` 0 to 255, and `Int8Array` -128 to 127. A fraction is cut off. A value outside the range wraps around: only its lowest 8 bits are kept.

`Uint8ClampedArray` clamps instead: below 0 gives 0, and above 255 gives 255. It rounds to the nearest whole number. A half goes to the even one: 2.5 gives 2, and 3.5 gives 4.

`Int16Array` holds -32768 to 32767, and `Uint16Array` 0 to 65535. `Float64Array` holds any number. `NaN` becomes 0 in the whole-number types.

**Common mistake:** adding up in a type that is too small.

**Wrong**

```js
const totals = «new Uint8Array(1)»;
totals[0] = 200;
totals[0] += 100;

console.log(totals[0]);
```

**Output**

```text
44
```

**Fix**

```js
const totals = «new Uint16Array(1)»;
totals[0] = 200;
totals[0] += 100;

console.log(totals[0]);
```

300 does not fit in one byte, so it wrapped to 300 - 256 = 44, with no error. Pick a type wide enough for every value.

<!-- task -->

## One buffer, two views

**Code**

```js
const buffer = new ArrayBuffer(6);
const all = new Uint8Array(buffer);
const middle = new Uint8Array(buffer, 2, 3);

middle[0] = 9;
all[4] = 7;

console.log(all.join(","));
console.log(middle.join(","));
console.log(middle.byteOffset, middle.length);
```

**Output**

```text
0,0,9,0,7,0
9,0,7
2 3
```

**Rule:** Several views can share one buffer. A write through one view changes the bytes that every other view sees. `new Uint8Array(buffer, offset, length)` views part of the buffer, starting at byte `offset`.

`bytes.subarray(start, end)` makes a new view on the same bytes. `bytes.slice(start, end)` copies them into a new buffer.

`Float64Array.BYTES_PER_ELEMENT` is `8`. So a `Float64Array` on a 12-byte buffer throws a `RangeError`: 12 bytes do not split into 8-byte items.

**Common mistake:** using `slice` when the view should share the bytes.

**Wrong**

```js
const pixels = Uint8Array.from([10, 20, 30, 40]);
const firstTwo = pixels.«slice»(0, 2);

firstTwo[0] = 99;
console.log(pixels.join(","));
```

**Output**

```text
10,20,30,40
```

**Fix**

```js
const pixels = Uint8Array.from([10, 20, 30, 40]);
const firstTwo = pixels.«subarray»(0, 2);

firstTwo[0] = 99;
console.log(pixels.join(","));
```

On a typed array, `slice` copies, just as it does on an array. `subarray` gives a view on the same buffer, so writing through it changes `pixels`.

<!-- task -->

## DataView and byte order

**Code**

```js
const buffer = new ArrayBuffer(4);
const view = new DataView(buffer);

view.setUint16(0, 258);
view.setUint16(2, 258, true);

console.log(new Uint8Array(buffer).join(","));
console.log(view.getUint16(0), view.getUint16(2, true));
console.log(view.getUint16(2));
```

**Output**

```text
1,2,2,1
258 258
513
```

**Rule:** A number of two or more bytes can be stored high byte first or low byte first. These orders are called big-endian and little-endian. A `DataView` reads and writes any type at any byte offset. It uses big-endian unless the last argument is `true`.

258 is 1 × 256 + 2. Big-endian writes the bytes 1 and 2, and little-endian writes 2 and 1.

`new Uint16Array(buffer)` uses the byte order of the machine, which is little-endian on nearly every computer. Use a `DataView` when a file format fixes the order.

**Common mistake:** reading little-endian data with the default order.

**Wrong**

```js
const bytes = Uint8Array.from([0x34, 0x12]);
const view = new DataView(bytes.buffer);

console.log(view.«getUint16(0)».toString(16));
```

**Output**

```text
3412
```

**Fix**

```js
const bytes = Uint8Array.from([0x34, 0x12]);
const view = new DataView(bytes.buffer);

console.log(view.«getUint16(0, true)».toString(16));
```

The bytes hold `0x1234` with the low byte first. Without `true`, the `DataView` reads the first byte as the high one. `bytes.buffer` is the buffer under a typed array.

<!-- task -->

## Remember

- An `ArrayBuffer` holds raw bytes. A typed array is a view with one number type and a fixed length.
- A value outside the range wraps around and a fraction is cut off. `Uint8ClampedArray` clamps and rounds instead.
- Views on one buffer share its bytes. `subarray` shares, and `slice` copies.
- A `DataView` reads any type at any offset. It is big-endian unless you pass `true`.
