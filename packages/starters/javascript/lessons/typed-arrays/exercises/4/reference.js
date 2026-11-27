export function toBytes(values) {
  const view = new DataView(new ArrayBuffer(values.length * 2));

  values.forEach((value, i) => {
    view.setUint16(i * 2, value);
  });

  return Array.from(new Uint8Array(view.buffer));
}
