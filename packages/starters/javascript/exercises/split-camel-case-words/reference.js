const wordStart = /(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/;

export function identifierWords(name) {
  return name.split(wordStart);
}
