export function firstTrackTitle(album) {
  return album?.tracks?.[0]?.title?.toUpperCase() ?? null;
}
