export async function withBusyFlag(state, task) {
  state.busy = true;
  try {
    return await task();
  } finally {
    state.busy = false;
  }
}
