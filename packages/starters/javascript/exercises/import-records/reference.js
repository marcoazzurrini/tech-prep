export async function importAll(ids, load, save) {
  return Promise.all(
    ids.map(async (id) => {
      const record = await load(id);
      return save(record);
    })
  );
}
