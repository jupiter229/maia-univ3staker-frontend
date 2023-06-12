import { ZERO } from "@/config/constants/const";
import JSBI from "jsbi";
import { SqrtPriceMath } from "./uniswap/sqrtPriceMath";
import { TickMath } from "./uniswap/tickMath";

export function getPositionAmounts(
  tickCurrent: number,
  tickLower: number,
  tickUpper: number,
  liquidity: number,
  sqrtRatioX96: number
): [number, number] {
  return _getPositionAmounts(
    Number(tickCurrent),
    Number(tickLower),
    Number(tickUpper),
    JSBI.BigInt(liquidity),
    JSBI.BigInt(sqrtRatioX96)
  );
}

function _getPositionAmounts(
  tickCurrent: number,
  tickLower: number,
  tickUpper: number,
  liquidity: JSBI,
  sqrtRatioX96: JSBI
): [number, number] {
  const amount0 = getAmount0(
    tickCurrent,
    tickLower,
    tickUpper,
    liquidity,
    sqrtRatioX96
  );

  const amount1 = getAmount1(
    tickCurrent,
    tickLower,
    tickUpper,
    liquidity,
    sqrtRatioX96
  );

  return [JSBI.toNumber(amount0), JSBI.toNumber(amount1)];
}

/**
 * Returns the amount of token0 that this position's liquidity could be burned for at the current pool price
 */
function getAmount0(
  tickCurrent: number,
  tickLower: number,
  tickUpper: number,
  liquidity: JSBI,
  sqrtRatioX96: JSBI
): JSBI {
  if (tickCurrent < tickLower) {
    return SqrtPriceMath.getAmount0Delta(
      TickMath.getSqrtRatioAtTick(tickLower),
      TickMath.getSqrtRatioAtTick(tickUpper),
      liquidity,
      false
    );
  } else if (tickCurrent < tickUpper) {
    return SqrtPriceMath.getAmount0Delta(
      sqrtRatioX96,
      TickMath.getSqrtRatioAtTick(tickUpper),
      liquidity,
      false
    );
  } else {
    return JSBI.BigInt(ZERO);
  }
}

/**
 * Returns the amount of token1 that this position's liquidity could be burned for at the current pool price
 */
function getAmount1(
  tickCurrent: number,
  tickLower: number,
  tickUpper: number,
  liquidity: JSBI,
  sqrtRatioX96: JSBI
): JSBI {
  if (tickCurrent < tickLower) {
    return JSBI.BigInt(ZERO);
  } else if (tickCurrent < tickUpper) {
    return SqrtPriceMath.getAmount1Delta(
      TickMath.getSqrtRatioAtTick(tickLower),
      sqrtRatioX96,
      liquidity,
      false
    );
  } else {
    return SqrtPriceMath.getAmount1Delta(
      TickMath.getSqrtRatioAtTick(tickLower),
      TickMath.getSqrtRatioAtTick(tickUpper),
      liquidity,
      false
    );
  }
}
