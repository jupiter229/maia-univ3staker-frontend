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

  const ethPrice = useGetEthPriceQuery();

  console.log("ethPrice", ethPrice);

  const { data, loading: incentivesLoading } = useGetIncentivesQuery({
    client,
  });

  const { data: poolsData, loading: poolsLoading } = useGetPoolsQuery({
    variables: { filter: { id_in: data?.incentives.map((i) => i.pool) } },
  });

  console.log("poolData", poolsData);

  const day = (new Date().getTime() / 86400000 - 1).toFixed(0);

  const { data: poolsDayData, loading: poolsDayLoading } =
    useGetPoolDayDataQuery({
      variables: {
        filter: { id_in: data?.incentives.map((i) => i.pool + "-" + day) },
      },
    });

  console.log("poolsDayData", poolsDayData);

  const { data: rewardTokensData, loading: tokensLoading } = useGetTokensQuery({
    variables: {
      filter: { id_in: data?.incentives.map((i) => i.rewardToken) },
    },
  });
  const result: IIncentive[] | undefined = useMemo(() => {
    const pools = poolsData?.pools;
    const rewardTokens = rewardTokensData?.tokens;
    const poolsDayDatas = poolsDayData?.poolDayDatas;
    if (!data || !pools || !rewardTokens || !poolsDayDatas) return;
    return data.incentives
      .map((i) => {
        const pool = pools.find((p) => p.id === i.pool);
        const poolDayData = poolsDayDatas.find((d) => d.pool.id === pool?.id);
        const rewardToken = rewardTokens.find((t) => t.id === i.rewardToken);
        const tokenPriceUSD = rewardToken?.derivedETH * ethPrice.data?.ethPrice;
        const feeTier = pool?.feeTier;
        if (!pool || !rewardToken || !poolDayData || !feeTier) return;
        return {
          ...i,
          pool,
          rewardToken,
          poolDayData,
          feeTier,
        };
      })
      .filter(Boolean) as IIncentive[];
  }, [
    data,
    poolsData?.pools,
    rewardTokensData?.tokens,
    poolsDayData?.poolDayDatas,
  ]);
  const loading = incentivesLoading || poolsLoading || tokensLoading;
  return [result, loading] as const;
};
