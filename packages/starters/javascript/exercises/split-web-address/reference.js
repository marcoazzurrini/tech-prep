const ADDRESS = /^(?<protocol>https?):\/\/(?<host>[A-Za-z0-9.-]+)(?::(?<port>\d+))?(?<path>\/.*)?$/;

export function splitAddress(url) {
  const found = url.match(ADDRESS);

  if (found === null) {
    return null;
  }

  const { protocol, host, port, path } = found.groups;

  return {
    protocol,
    host,
    port: port === undefined ? null : Number(port),
    path: path ?? "/",
  };
}
