# File Size Label (medium)

Write `fileSize(bytes)`. It returns a short label for a file size.

Under 1024 bytes, the label is the number of bytes and `B`. Otherwise divide by 1024 until the size is under 1024, and use `KB`, `MB`, `GB` or `TB`. Show such a size with exactly one decimal.

Example 1: fileSize(512)  ->  "512 B"
Example 2: fileSize(1536)  ->  "1.5 KB"
Example 3: fileSize(1048576)  ->  "1.0 MB"
Example 4: fileSize(123456789)  ->  "117.7 MB"

Note: `bytes` is a whole number, 0 or more.
