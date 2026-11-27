export function startTimer(ms, value) {
  let cancel;

  const done = new Promise((resolve, reject) => {
    const id = setTimeout(resolve, ms, value);

    cancel = () => {
      clearTimeout(id);
      reject(new Error("cancelled"));
    };
  });

  return { cancel, done };
}
