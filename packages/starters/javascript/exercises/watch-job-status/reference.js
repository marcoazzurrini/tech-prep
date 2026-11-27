export async function* watchJob(check) {
  while (true) {
    const status = await check();
    yield status;

    if (status === "done" || status === "failed") {
      return;
    }
  }
}
