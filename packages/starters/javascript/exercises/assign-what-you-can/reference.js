export function assignWhatYouCan(target, source) {
  const skipped = [];

  for (const key of Reflect.ownKeys(source)) {
    if (!Object.prototype.propertyIsEnumerable.call(source, key)) {
      continue;
    }

    if (!Reflect.set(target, key, source[key])) {
      skipped.push(key);
    }
  }

  return skipped;
}
