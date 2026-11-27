export function thrownText(task) {
  try {
    task();
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }

  return "no error";
}
