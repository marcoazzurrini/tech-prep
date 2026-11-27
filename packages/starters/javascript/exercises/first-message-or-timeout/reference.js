export function firstMessage(listen, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("no message")), ms);

    listen((message) => {
      clearTimeout(timer);
      resolve(message);
    });
  });
}
