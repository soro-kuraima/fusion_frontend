function formatAmount(amount, index = 4) {
  if (Number(amount) < 1 / 10 ** index && Number(amount) !== 0) {
    return "<" + 1 / 10 ** index;
  } else {
    return Number(amount).toFixed(index);
  }
}

export { formatAmount };
