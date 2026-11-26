export function createTagger(tag) {
  return {
    tag,
    tagAll(words) {
      const tagged = [];

      words.forEach((word) => {
        tagged.push(this.tag + word);
      });

      return tagged;
    },
  };
}
