import {
  IIncentive,
  useGetEthPriceQuery,
  useGetIncentiveQuery,
  useGetIncentivesQuery,
  useGetPoolDayDataQuery,
  useGetPoolQuery,
  useGetPoolsQuery,
  useGetTickQuery,
  useGetTokenQuery,
  useGetTokensQuery,
} from "@/types";
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

  console.log("poolsData", poolsData);

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

  console.log(
    "tickQuery",
    poolsData?.pools.map(
      (p) =>
        p.id +
        "#" +
        Math.floor(p.tick / ((p.feeTier / 100) * 2)) * ((p.feeTier / 100) * 2)
    )
  );

  const { data: ticksData, loading: ticksLoading } = useGetTickQuery({
    variables: {
      filter: {
        id_in: poolsData?.pools.map(
          (p) =>
            p.id +
            "#" +
            Math.floor(p.tick / ((p.feeTier / 100) * 2)) *
              ((p.feeTier / 100) * 2)
        ),
      },
    },
  });

  console.log("pools", poolsData?.pools);

  console.log("ticksData", ticksData);

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
      !poolTokens ||
      !ticksData
    )
      return;
    return data.incentives
      .map((i) => {
        console.log("ENTERED");
        const pool = pools.find((p) => p.id === i.pool);
        const poolDayData = poolsDayDatas.find((d) => d.pool.id === pool?.id);

        const rewardToken = rewardTokens.find((t) => t.id === i.rewardToken);
        const poolToken0 = poolTokens.find((p) => p.id === pool?.token0.id);
        const poolToken1 = poolTokens.find((p) => p.id === pool?.token1.id);

        const tokenPriceUSD =
          rewardToken?.derivedETH * ethPrice.bundles[0].ethPriceUSD;
        const poolToken0PriceUSD =
          poolToken0?.derivedETH * ethPrice.bundles[0].ethPriceUSD;
        const poolToken1PriceUSD =
          poolToken1?.derivedETH * ethPrice.bundles[0].ethPriceUSD;

        const feeTier = pool?.feeTier;
        const activeLiqudity = pool?.liquidity;
        const totalLiquidty = pool?.totalLiquidity;
        const currentSqrPrice = pool?.sqrtPrice;
        const currentTick = ticksData.ticks.find(
          (t) => t.pool.id === pool?.id && t.tickIdx === pool?.tick
        );

        console.log("currentTick", currentTick);

        if (
          !pool ||
          !rewardToken ||
          !poolDayData ||
          !tokenPriceUSD ||
          !activeLiqudity ||
          !totalLiquidty ||
          !currentSqrPrice ||
          !currentTick ||
          !feeTier ||
          !poolToken0 ||
          !poolToken1 ||
          !poolToken0PriceUSD ||
          !poolToken1PriceUSD
        )
          return;
        return {
          ...i,
          pool,
          rewardToken,
          poolDayData,
          tokenPriceUSD,
          activeLiqudity,
          totalLiquidty,
          currentSqrPrice,
          currentTick,
          poolToken0,
          poolToken1,
          poolToken0PriceUSD,
          poolToken1PriceUSD,
          feeTier,
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
    ticksData,
  ]);
  console.log("EXITED");
  const loading =
    incentivesLoading ||
    poolsLoading ||
    tokensLoading ||
    ethPriceLoading ||
    poolsDayLoading ||
    poolTokensLoading ||
    ticksLoading;
  return [result, loading] as const;
};
