export function explainFailure(promises) {
  return Promise.any(promises).catch((error) => {
    const messages = error.errors.map((reason) => reason.message);
    throw new Error("failed: " + messages.join(", "));
  });
}
