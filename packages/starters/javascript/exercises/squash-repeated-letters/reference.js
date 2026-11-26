export function squash(text) {
  let result = "";
  let run = 0;

  for (let i = 0; i < text.length; i += 1) {
    run += 1;

    if (text[i] !== text[i + 1]) {
      result += run > 1 ? text[i] + run : text[i];
      run = 0;
    }
  }

  return result;
}
