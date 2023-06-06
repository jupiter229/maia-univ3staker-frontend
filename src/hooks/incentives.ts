import {
  IIncentive,
  useGetEthPriceQuery,
  useGetIncentiveQuery,
  useGetIncentivesQuery,
  useGetPoolDayDataQuery,
  useGetPoolQuery,
  useGetPoolsQuery,
  useGetTokenQuery,
  useGetTokensQuery,
} from "@/types";
import { getActiveLiquidityUSD, positionEfficiency } from "@/utils/tvl";
import { useMemo } from "react";
import { useGraphClient } from "./web3";

export const useIncentive = (id: string) => {
  const client = useGraphClient();

  const { data, loading: incentiveLoading } = useGetIncentiveQuery({
    client,
    variables: { id },
  });

  const incentive = data?.incentive;

  const { data: poolsData, loading: poolLoading } = useGetPoolQuery({
    variables: { id: incentive?.pool },
  });

  const { data: rewardTokensData, loading: tokenLoading } = useGetTokenQuery({
    variables: { id: incentive?.rewardToken },
  });

  const result: IIncentive | undefined = useMemo(() => {
    const pool = poolsData?.pool;
    const rewardToken = rewardTokensData?.token;
    if (!incentive || !pool || !rewardToken) return;
    return {
      ...incentive,
      pool,
      rewardToken,
    };
  }, [incentive, poolsData?.pool, rewardTokensData?.token]);
  const loading = incentiveLoading || poolLoading || tokenLoading;
  return [result, loading] as const;
};

export const useIncentives = () => {
  const client = useGraphClient();

  const { data: ethPrice, loading: ethPriceLoading } = useGetEthPriceQuery({
    variables: { filter: { id_in: ["1"] } },
  });

  const { data, loading: incentivesLoading } = useGetIncentivesQuery({
    client,
  });

  const { data: poolsData, loading: poolsLoading } = useGetPoolsQuery({
    variables: { filter: { id_in: data?.incentives.map((i) => i.pool) } },
  });

  const day = (new Date().getTime() / 86400000 - 1).toFixed(0);

  const { data: poolsDayData, loading: poolsDayLoading } =
    useGetPoolDayDataQuery({
      variables: {
        filter: { id_in: data?.incentives.map((i) => i.pool + "-" + day) },
      },
    });

  const { data: poolTokensData, loading: poolTokensLoading } =
    useGetTokensQuery({
      variables: {
        filter: {
          id_in: poolsData?.pools.map((i) => [i.token0.id, i.token1.id]).flat(),
        },
      },
    });

  const { data: rewardTokensData, loading: tokensLoading } = useGetTokensQuery({
    variables: {
      filter: { id_in: data?.incentives.map((i) => i.rewardToken) },
    },
  });

  const result: IIncentive[] | undefined = useMemo(() => {
    const pools = poolsData?.pools;
    const rewardTokens = rewardTokensData?.tokens;
    const poolsDayDatas = poolsDayData?.poolDayDatas;
    const poolTokens = poolTokensData?.tokens;
    if (
      !data ||
      !pools ||
      !rewardTokens ||
      !poolsDayDatas ||
      !ethPrice ||
      !poolTokens
    )
      return;
    return data.incentives
      .map((i) => {
        const pool = pools.find((p) => p.id === i.pool);
        let poolDayData = poolsDayDatas.find((d) => d.pool.id === pool?.id);

        const rewardToken = rewardTokens.find((t) => t.id === i.rewardToken);
        const poolToken0 = poolTokens.find((p) => p.id === pool?.token0.id);
        const poolToken1 = poolTokens.find((p) => p.id === pool?.token1.id);

        let tokenPriceUSD =
          rewardToken?.derivedETH * ethPrice.bundles[0].ethPriceUSD;

        const poolToken0PriceUSD =
          poolToken0?.derivedETH * ethPrice.bundles[0].ethPriceUSD;
        const poolToken1PriceUSD =
          poolToken1?.derivedETH * ethPrice.bundles[0].ethPriceUSD;

        const activeLiqudity = pool?.liquidity;

        let activeLiqudityUSD = getActiveLiquidityUSD(
          activeLiqudity,
          pool?.tick,
          pool?.feeTier,
          poolToken0?.decimals,
          poolToken1?.decimals,
          poolToken0PriceUSD,
          poolToken1PriceUSD
        );

        let fullRangeLiquidityUSD =
          activeLiqudityUSD * positionEfficiency(pool?.feeTier, i.minWidth);

        if (!pool || !rewardToken) {
          return;
        } else if (
          !poolDayData ||
          !tokenPriceUSD ||
          !activeLiqudityUSD ||
          !fullRangeLiquidityUSD
        ) {
          poolDayData = { date: 0, feesUSD: 0, pool: pool };
          tokenPriceUSD = 0;
          activeLiqudityUSD = 0;
          fullRangeLiquidityUSD = 0;
        }

        return {
          ...i,
          pool,
          rewardToken,
          poolDayData,
          tokenPriceUSD,
          activeLiqudityUSD,
          fullRangeLiquidityUSD,
        };
      })
      .filter(Boolean) as IIncentive[];
  }, [
    poolsData?.pools,
    rewardTokensData?.tokens,
    poolsDayData?.poolDayDatas,
    data,
    ethPrice,
    poolTokensData?.tokens,
  ]);

  const loading =
    incentivesLoading ||
    poolsLoading ||
    tokensLoading ||
    ethPriceLoading ||
    poolsDayLoading ||
    poolTokensLoading;
  return [result, loading] as const;
};
