export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
  }
}

export async function saveDraft(store, draft) {
  store.saving = true;
  try {
    return await store.save(draft);
  } catch (error) {
    if (error instanceof ConflictError) {
      return "conflict";
    }
    throw error;
  } finally {
    store.saving = false;
  }
}
