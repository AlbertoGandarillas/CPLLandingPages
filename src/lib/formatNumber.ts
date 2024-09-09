export const formatCurrency = (amount: number): string => {
  if (amount === 0) {
    return "0"; // Return just "0" or any other string that represents zero without the dollar sign
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    // To remove decimal parts, you can adjust these options:
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatWithCommas = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};