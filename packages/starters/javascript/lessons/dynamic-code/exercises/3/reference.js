export function makeFunction(params, body) {
  return new Function(...params, `"use strict";\n${body}`);
}
