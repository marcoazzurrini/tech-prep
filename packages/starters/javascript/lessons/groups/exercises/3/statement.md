`isImageFile(name)` should return `true` when `name` ends with `.png`, `.jpg`, `.jpeg` or `.gif`, in any case, and `false` otherwise.

The code below also accepts `"notes.png.txt"` and `"jpgfile"`. Fix it.

Example 1: isImageFile("photo.JPEG")  ->  true
Example 2: isImageFile("notes.png.txt")  ->  false
Example 3: isImageFile("gif")  ->  false
