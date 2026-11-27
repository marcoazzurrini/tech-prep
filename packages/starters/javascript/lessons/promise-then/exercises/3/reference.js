export function toText(promise) {
  return promise.then(
    (value) => "ok: " + value,
    (error) => "error: " + error.message
  );
}
