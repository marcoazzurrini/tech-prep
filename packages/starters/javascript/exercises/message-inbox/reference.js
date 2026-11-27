export class Inbox {
  messages = [];
  unread = 0;

  receive = (text) => {
    this.messages.push(text);
    this.unread += 1;

    return this.unread;
  };

  markAllRead() {
    const count = this.unread;

    this.unread = 0;

    return count;
  }
}
