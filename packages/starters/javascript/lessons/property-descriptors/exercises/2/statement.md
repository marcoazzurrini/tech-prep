Write `addSerial(device, serial)`. It adds a property `serial` to the device and returns the device.

The serial number can be read, and `Object.keys` lists it. It can never be assigned again: an assignment throws a `TypeError`.

Example 1:
  const lamp = addSerial({ name: "Lamp" }, "L-1");
  lamp.serial  ->  "L-1"
  Object.keys(lamp)  ->  ["name", "serial"]
  lamp.serial = "X";  // throws a TypeError
