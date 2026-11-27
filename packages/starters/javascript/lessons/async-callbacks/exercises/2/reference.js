export function parseLater(text, callback) {
  setTimeout(() => {
    let value;

    try {
      value = JSON.parse(text);
    } catch (error) {
      callback(error);
      return;
    }

    callback(null, value);
  }, 0);
}
