import {
  IIncentive,
  IPosition,
  IStakedPosition,
  useGetEthPriceQuery,
  useGetPositionsQuery,
  useGetStakerPositionsQuery,
} from "@/types";
import { getPositionAmounts } from "@/utils/positions";
import { useMemo } from "react";
import { getAddress } from "viem";
import { useIncentives } from "./incentives";
import { useIncentiveRewards } from "./stake";
import { useGraphClient, useWeb3 } from "./web3";

export const useUserIncentivePositions = (
  incentive: IIncentive | undefined
) => {
  const [positions, positionsLoading] = useUserPositions(
    incentive?.pool.id || ""
  );

  const incentiveRewards = useIncentiveRewards(
    positions?.map((p) => ({
      incentive: incentive,
      tokenId: p.tokenId,
    })) ?? []
  );

  return {
    positions: [
      positions?.map((p, i) => ({
        ...p,
        incentiveRewards:
          incentiveRewards !== undefined ? incentiveRewards[i] : 0,
        incentive,
      })),
      positionsLoading,
    ],
  } as const;
};

export const useUserPositions = (poolId?: string) => {
  const { address } = useWeb3();
  const client = useGraphClient();

  const { data: ethPrice } = useGetEthPriceQuery({
    variables: { filter: { id_in: ["1"] } },
  });

  const { data: stakerData, loading: stakerLoading } =
    useGetStakerPositionsQuery({
      variables: { where: { owner: address || "" } },
      client,
    });
  const id_in = stakerData?.positions.map((p: any) => p.tokenId) || [];
  const { data, loading } = useGetPositionsQuery({
    variables: {
      where: {
        or: [
          {
            ...(poolId === undefined ? undefined : { pool: poolId }),
            owner: address || "",
          },
          { id_in },
        ],
      },
    },
  });
  const result = useMemo(() => {
    if (!data || !stakerData) return;
    const positions = data.positions
      .map((p: any) => {
        const stakerPosition = stakerData.positions.find(
          (sp) => sp.tokenId === p.id
        );

        const [amount0, amount1] = getPositionAmounts(
          p.pool.tick,
          p.tickLower.tickIdx,
          p.tickUpper.tickIdx,
          p.liquidity,
          p.pool.sqrtPrice
        );

        const valueUSD =
          ((p.pool.token0.derivedETH * amount0) / 10 ** p.pool.token0.decimals +
            (p.pool.token1.derivedETH * amount1) /
              10 ** p.pool.token1.decimals) *
          ethPrice?.bundles[0].ethPriceUSD;

        return {
          ...stakerPosition,
          ...p,
          amount0,
          amount1,
          valueUSD,
          deposited: p.owner !== stakerPosition?.owner,
        };
      })
      .filter((p: any) => (poolId === undefined ? true : p.pool.id === poolId));
    return positions as IPosition[];
  }, [data, ethPrice?.bundles, poolId, stakerData]);

  return [result, loading || stakerLoading] as const;
};

export const useUserStakedPositions = () => {
  const { address } = useWeb3();

  const [positions, positionsLoading] = useUserPositions();
  const [incentives, incentivesLoading] = useIncentives();

  const result = useMemo(() => {
    if (!positions) return;
    const result = positions
      .map((p: any) => {
        if (!p.deposited || p.staked) return;

        return { ...p, incentive: undefined };
      })
      .filter(Boolean) as IStakedPosition[];

    if (!incentives) return result;
    incentives.forEach((i: any) => {
      i?.stakedPositions?.forEach((p: any) => {
        if (getAddress(p.position.owner) === address)
          result.push({
            ...positions.find((pos) => pos.tokenId === p.position.tokenId),
            incentive: i,
          } as IStakedPosition);
      });
    });

    return result;
  }, [address, incentives, positions]);

  const incentiveRewards = useIncentiveRewards(
    result?.map((p) => ({
      incentive: p.incentive,
      tokenId: p.tokenId,
    })) ?? []
  );

  return [
    result?.map((p, i) => ({
      ...p,
      incentiveRewards: incentiveRewards != undefined ? incentiveRewards[i] : 0,
    })),
    positionsLoading || incentivesLoading,
  ] as const;
};
