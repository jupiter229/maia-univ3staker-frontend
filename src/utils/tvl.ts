import { ONE, TICK_INCREMENT, ZERO } from "@/config/constants/const";
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
  sqrtRatioX96: number,
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
    sqrtRatioX96,
    tickCurrent,
    liquidity,
    feeTier,
    tickSpacing
  );

  const amount1 = getAmountsCurrentTick(
    true,
    sqrtRatioX96,
    tickCurrent,
    liquidity,
    feeTier,
    tickSpacing
  );

  return (
    (amount0 / 10 ** decimals0) * price0 + (amount1 / 10 ** decimals1) * price1
  );
}

interface StepComputations {
  sqrtPriceStartX96: number;
  tickNext: number;
  sqrtPriceNextX96: JSBI;
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
  sqrtRatioX96: number,
  tickCurrent: number,
  liquidity: number,
  feeTier: number,
  tickSpacing: number
): number {
  const sqrtPriceLimitX96 = zeroForOne
    ? JSBI.add(TickMath.MIN_SQRT_RATIO, JSBI.BigInt(ONE))
    : JSBI.subtract(TickMath.MAX_SQRT_RATIO, JSBI.BigInt(ONE));

  // keep track of swap state
  const state = {
    amountCalculated: ZERO,
    sqrtPriceX96: sqrtRatioX96,
    tick: tickCurrent,
    liquidity: liquidity,
  };

  let step: Partial<StepComputations> = {};
  step.sqrtPriceStartX96 = state.sqrtPriceX96;

  step.tickNext = zeroForOne
    ? (Math.ceil(state.tick / tickSpacing) - 1) * tickSpacing
    : (Math.floor(state.tick / tickSpacing) + 1) * tickSpacing;

  if (step.tickNext < TickMath.MIN_TICK) {
    step.tickNext = TickMath.MIN_TICK;
  } else if (step.tickNext > TickMath.MAX_TICK) {
    step.tickNext = TickMath.MAX_TICK;
  }

  step.sqrtPriceNextX96 = TickMath.getSqrtRatioAtTick(step.tickNext);

  let amountOut: JSBI | undefined;

  [, , amountOut] = SwapMath.computeSwapStep(
    JSBI.BigInt(state.sqrtPriceX96),
    step.sqrtPriceNextX96,
    JSBI.BigInt(state.liquidity),
    LARGE_NUMBER_FOR_SWAP,
    feeTier
  );

  return Number(amountOut) ?? 0;
}
