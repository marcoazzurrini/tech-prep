export async function loadPage(getUser, getNews) {
  const [user, news] = await Promise.all([getUser(), getNews()]);
  return { user, news };
}
