export function addLater(a, b, callback) {
  setTimeout(() => {
    callback(a + b);
  }, 10);
}
