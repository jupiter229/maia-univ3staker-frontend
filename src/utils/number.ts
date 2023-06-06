export const formatUSD = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
  }).format(value);
};

export const formatBigInt = (
  value: BigInt,
  { decimals = 18, precision = 2 } = {}
) => {
  return (
    Number(value) /
    10 ** precision /
    10 ** decimals /
    10 ** precision
  ).toFixed(precision);
};
