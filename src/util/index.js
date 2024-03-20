export function getFormattedCurrency(amount, showTrailingZero = false) {
  if (typeof amount == 'number') {
    amount = '' + (showTrailingZero ? amount.toFixed(2) : amount);
  } else if (typeof amount == 'string') {
    amount = Number(amount.replace(/[^0-9-.]/g, '')).toFixed(2);
  }

  if (amount.startsWith(NEGATIVE_SIGN)) {
    let formattedAmountString = amount
      .substring(1)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return NEGATIVE_SIGN + RM + formattedAmountString;
  }

  return RM + amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function getNumberFromCurrency(amount) {
  if (typeof amount === 'number') {
    return amount;
  } else {
    return Number(amount.replace(/[^\d.-]/g, ''));
  }
}
