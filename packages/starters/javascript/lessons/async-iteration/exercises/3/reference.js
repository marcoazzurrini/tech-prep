export async function* allNames(getPage) {
  for (let n = 0; ; n++) {
    const names = await getPage(n);

    if (names.length === 0) {
      return;
    }

    yield* names;
  }
}
