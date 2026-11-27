// For the tests: a promise that settles after ms.
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function autosave(save, ms) {
  let timer;

  return {
    edit(text) {
      clearTimeout(timer);
      timer = setTimeout(() => save(text), ms);
    },
    discard() {
      clearTimeout(timer);
    },
  };
}
