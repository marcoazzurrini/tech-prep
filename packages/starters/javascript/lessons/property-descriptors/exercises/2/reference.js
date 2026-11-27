export function addSerial(device, serial) {
  return Object.defineProperty(device, "serial", { value: serial, enumerable: true });
}
