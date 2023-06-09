import { TICK_INCREMENT } from "@/config/constants/const";
import { SwapMath, TickMath } from "@uniswap/v3-sdk";
import JSBI from "jsbi";

export function positionEfficiency(feeTier: number, minWidth: number): number {
  const tickSpacing = feeTierToTickSpacing(feeTier);
  return (
    1 /
    (1 -
      (1 / (1 + TICK_INCREMENT * getLargerInTicks(tickSpacing, minWidth))) **
        (1 / 4))
  );
}

export function getLargerInTicks(
  tickSpacing: number,
  minWidth: number
): number {
  return Math.max(
    tickSpacing,
    (Math.floor(minWidth / tickSpacing) + 1) * tickSpacing
  );
}

export function feeTierToTickSpacing(feeTier: number): number {
  if (feeTier == 100) return 1;
  if (feeTier == 500) return 10;
  if (feeTier == 3000) return 60;
  if (feeTier == 10000) return 200;
  return 0;
}

export function convertBasedOnEfficiency(
  amount: number,
  feeTier: number,
  minWidth: number
): number {
  return (
    (amount * positionEfficiency(feeTier, 0)) /
    positionEfficiency(feeTier, minWidth)
  );
}

export function getAmountsCurrentTickUSD(
  sqrtPriceX96: number,
  tickCurrent: number,
  liquidity: number,
  feeTier: number,
  decimals0: number,
  decimals1: number,
  price0: number,
  price1: number
) {
  const tickSpacing = feeTierToTickSpacing(feeTier);

  if (!tickCurrent) return 0;

  const amount0 = getAmountsCurrentTick(
    false,
    sqrtPriceX96,
    tickCurrent,
    liquidity,
    feeTier,
    tickSpacing
  );

  const amount1 = getAmountsCurrentTick(
    true,
    sqrtPriceX96,
    tickCurrent,
    liquidity,
    feeTier,
    tickSpacing
  );

  return (
    (amount0 / 10 ** decimals0) * price0 + (amount1 / 10 ** decimals1) * price1
  );
}

export const LARGE_NUMBER_FOR_SWAP = JSBI.BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

/**
 * Executes a swap
 * @param zeroForOne Whether the amount in is token0 or token1
 * @returns amountCalculated
 */
function getAmountsCurrentTick(
  zeroForOne: boolean,
  sqrtPriceX96: number,
  tickCurrent: number,
  liquidity: number,
  feeTier: number,
  tickSpacing: number
): number {
  const [, , amountOut] = SwapMath.computeSwapStep(
    JSBI.BigInt(sqrtPriceX96),
    getSqrtPriceNext(zeroForOne, tickCurrent, tickSpacing),
    JSBI.BigInt(liquidity),
    LARGE_NUMBER_FOR_SWAP,
    feeTier
  );

  return Number(amountOut) ?? 0;
}

function getSqrtPriceNext(
  zeroForOne: boolean,
  tickCurrent: number,
  tickSpacing: number
) {
  let tickNext = zeroForOne
    ? (Math.ceil(tickCurrent / tickSpacing) - 1) * tickSpacing
    : (Math.floor(tickCurrent / tickSpacing) + 1) * tickSpacing;

  if (tickNext < TickMath.MIN_TICK) {
    tickNext = TickMath.MIN_TICK;
  } else if (tickNext > TickMath.MAX_TICK) {
    tickNext = TickMath.MAX_TICK;
  }

  return TickMath.getSqrtRatioAtTick(tickNext);
}
