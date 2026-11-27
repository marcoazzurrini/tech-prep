export function runInSlices(items, size, handle, done) {
  let index = 0;

  const runSlice = () => {
    const end = Math.min(index + size, items.length);

    for (; index < end; index++) {
      handle(items[index]);
    }

    if (index < items.length) {
      setTimeout(runSlice, 0);
    } else {
      done();
    }
  };

  runSlice();
}
