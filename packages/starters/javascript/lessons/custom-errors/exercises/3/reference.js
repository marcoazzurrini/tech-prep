export class ImportError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "ImportError";
  }
}

export function importUsers(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new ImportError("bad file", { cause: error });
  }
}
