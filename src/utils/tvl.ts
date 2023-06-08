import { TICK_BASE, TICK_INCREMENT } from "@/config/constants/const";

export function positionEfficiency(feeTier: number, minWidth: number): number {
  const tickSpacing = feeTierToTickSpacing(feeTier);
  const tickRange = Math.max(
    tickSpacing,
    Math.floor(minWidth / tickSpacing) * tickSpacing
  );
  return 1 / (1 - (1 / (1 + TICK_INCREMENT * tickRange)) ** (1 / 4));
}

// Convert Uniswap v3 tick to a price (i.e. the ratio between the amounts of tokens: token1/token0)
function tickToPrice(tick: number): number {
  return TICK_BASE ** tick;
}

function feeTierToTickSpacing(feeTier: number): number {
  if (feeTier == 100) return 1;
  if (feeTier == 500) return 10;
  if (feeTier == 3000) return 60;
  if (feeTier == 10000) return 200;
  return 0;
}

function getActiveLiquidityAmounts(
  liqudity: number,
  tick: number,
  feeTier: number,
  decimals0: number,
  decimals1: number
): { adjustedAmount0: number; adjustedAmount1: number } {
  const tickSpacing = feeTierToTickSpacing(feeTier);

  // Compute the tick range
  const bottomTick = Math.floor(tick / tickSpacing) * tickSpacing;
  const topTick = bottomTick + tickSpacing;

  // Compute the current price and adjust it to a human-readable format
  const price = tickToPrice(tick);

  // Compute square roots of prices corresponding to the bottom and top ticks
  const sa = tickToPrice(Math.floor(bottomTick / 2));
  const sb = tickToPrice(Math.floor(topTick / 2));
  const sp = price ** 0.5;

  // Compute real amounts of the two assets
  const amount0 = (liqudity * (sb - sp)) / (sp * sb);
  const amount1 = liqudity * (sp - sa);

  // Adjust them to a human-readable format
  const adjustedAmount0 = amount0 / 10 ** decimals0;
  const adjustedAmount1 = amount1 / 10 ** decimals1;

  return { adjustedAmount0, adjustedAmount1 };
}

export function getActiveLiquidityUSD(
  liqudity: number,
  tick: number,
  feeTier: number,
  decimals0: number,
  decimals1: number,
  price0: number,
  price1: number
) {
  const { adjustedAmount0, adjustedAmount1 } = getActiveLiquidityAmounts(
    liqudity,
    tick,
    feeTier,
    decimals0,
    decimals1
  );

  return adjustedAmount0 * price0 + adjustedAmount1 * price1;
}
