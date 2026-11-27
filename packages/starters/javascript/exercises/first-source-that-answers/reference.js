export function wait(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function failAfter(ms, message) {
  return new Promise((resolve, reject) => setTimeout(() => reject(new Error(message)), ms));
}

export function firstAnswer(sources) {
  let answer = new Promise((resolve, reject) => reject(new Error("no sources")));

  for (const source of sources) {
    answer = answer.catch(() => source());
  }

  return answer;
}
