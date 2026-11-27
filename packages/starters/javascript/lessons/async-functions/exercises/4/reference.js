export class Inbox {
  constructor(messages) {
    this.messages = messages;
  }

  async unread() {
    return this.messages.filter((message) => !message.read).length;
  }
}
