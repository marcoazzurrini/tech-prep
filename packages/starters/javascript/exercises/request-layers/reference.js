// For the tests: a layer that logs "name in", calls the handler, then logs "name out".
export const layer = (log, name) => (handler) => (request) => {
  log.push(`${name} in`);
  const response = handler(request);
  log.push(`${name} out`);
  return response;
};

export function withLayers(handler, layers) {
  return layers.reduceRight((inner, wrap) => wrap(inner), handler);
}
