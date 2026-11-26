const lineTotal = (item) => item.price * item.qty;

const toLine = (item) => ({ total: lineTotal(item) });

export const receiptLines = (items) => items.map(toLine);
