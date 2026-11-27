export const comparable = {
  equals(other) {
    return this.compareTo(other) === 0;
  },

  lessThan(other) {
    return this.compareTo(other) < 0;
  },

  greaterThan(other) {
    return this.compareTo(other) > 0;
  },

  between(low, high) {
    return this.compareTo(low) >= 0 && this.compareTo(high) <= 0;
  },
};

export class Version {
  constructor(major, minor) {
    this.major = major;
    this.minor = minor;
  }

  compareTo(other) {
    return this.major - other.major || this.minor - other.minor;
  }
}

Object.assign(Version.prototype, comparable);
