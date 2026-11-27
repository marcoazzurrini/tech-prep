Write `toBytes(values)`. Each value is a whole number from 0 to 65535, which fits in two bytes.

Return a plain array of all the bytes, two per value, in the order of `values`. Store each value big-endian: its high byte first.

Example 1: toBytes([258])  ->  [1, 2]
Example 2: toBytes([65535, 0])  ->  [255, 255, 0, 0]
Example 3: toBytes([])  ->  []
