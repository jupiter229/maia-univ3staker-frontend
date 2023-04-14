import { BigNumber, BigNumberish } from "ethers";

export const formatUSD = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
  }).format(value);
};

export const formatBigNumber = (
  value: BigNumberish,
  { decimals = 18, precision = 2 } = {}
) => {
  return BigNumber.from(value)
    .div(BigNumber.from(10).pow(decimals))
    .toNumber()
    .toFixed(precision);
};
