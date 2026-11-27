function sendOnce(send, message) {
  return new Promise((resolve, reject) => {
    send(message, (error, receipt) => (error ? reject(error) : resolve(receipt)));
  });
}

export async function deliver(send, message, tries) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await sendOnce(send, message);
    } catch (error) {
      if (attempt >= tries) {
        throw error;
      }
    }
  }
}
