export function getActiveLiquidityUSD(
  poolAddress: string,
  sqrtPrice: number,
  activeLiqudity: number,
  totalLiquidity: number,
  token0Price: number,
  token1Price: number
) {
  let amounts0 = 0;
  let amounts1 = 0;
  let liquidity = 0;

  function calculateToken0Amount(
    liquidity: number,
    sp: number,
    sl: number,
    sh: number
  ) {
    sp = Math.max(Math.min(sp, sh), sl);
    return (liquidity * (sh - sp)) / (sp * sh);
  }

  function calculateToken1Amount(
    liquidity: number,
    sp: number,
    sl: number,
    sh: number
  ) {
    sp = Math.max(Math.min(sp, sh), sl);
    return liquidity * (sp - sl);
  }

  const sqrtPriceLow = 1; //1.0001 ** Math.floor(tick / 2);
  const sqrtPriceHigh = 1; //1.0001 ** Math.floor((tick + TICK_SPACING) / 2);

  amounts0 += calculateToken0Amount(
    activeLiqudity,
    sqrtPrice,
    sqrtPriceLow,
    sqrtPriceHigh
  );
  amounts1 += calculateToken1Amount(
    activeLiqudity,
    sqrtPrice,
    sqrtPriceLow,
    sqrtPriceHigh
  );
}

export function getTotalLiquidityUSD(poolAddress: string) {}
