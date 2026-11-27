export function Logger(prefix) {
  this.prefix = prefix;
  this.entries = [];
}
Logger.prototype.record = function (msg) {
  this.entries.push(this.prefix + ": " + msg);
  return this;
};

export function TaggedLogger(prefix, tag) {
  Logger.call(this, prefix);
  this.tag = tag;
}
TaggedLogger.prototype = Object.create(Logger.prototype);
TaggedLogger.prototype.constructor = TaggedLogger;
TaggedLogger.prototype.record = function (msg) {
  return Logger.prototype.record.call(this, "[" + this.tag + "] " + msg);
};
