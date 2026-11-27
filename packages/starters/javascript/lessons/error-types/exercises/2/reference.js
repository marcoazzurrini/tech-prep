export function toPlain(error) {
  const plain = { name: error.name, message: error.message };

  if (error.cause !== undefined) {
    plain.cause = error.cause instanceof Error ? toPlain(error.cause) : error.cause;
  }

  return plain;
}
