export const note = {
  tags: [],
  addTag(tag) {
    this.tags = [...this.tags, tag];
    return this.tags.length;
  },
};
