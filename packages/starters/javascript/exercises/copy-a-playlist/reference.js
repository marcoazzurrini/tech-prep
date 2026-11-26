export function copyPlaylist(playlist) {
  return { ...playlist, name: `${playlist.name} (copy)`, songs: [...playlist.songs] };
}
