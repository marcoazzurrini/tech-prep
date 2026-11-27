const made = new Map();

export function Currency(code) {
  if (made.has(code)) {
    return made.get(code);
  }

  this.code = code;
  made.set(code, this);
}
