export async function loadWithBackup(primary, backup) {
  try {
    return await primary();
  } catch {
    try {
      return await backup();
    } catch (error) {
      throw new Error("both failed", { cause: error });
    }
  }
}
