export function readHeader(bytes) {
  const view = new DataView(Uint8Array.from(bytes).buffer);

  return {
    width: view.getUint16(0, true),
    height: view.getUint16(2, true),
    x: view.getInt32(4, true),
  };
}
