export class TextStage {
  #runs = 0;

  get runs() {
    return this.#runs;
  }

  transform(text) {
    return text;
  }

  run(text) {
    this.#runs += 1;
    return this.transform(text);
  }
}

export class TrimStage extends TextStage {
  transform(text) {
    return text.trim();
  }
}

export class ShoutStage extends TrimStage {
  transform(text) {
    return super.transform(text).toUpperCase();
  }
}
