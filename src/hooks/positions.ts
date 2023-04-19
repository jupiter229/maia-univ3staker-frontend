import {
  IPosition,
  useGetPositionsQuery,
  useGetStakerPositionsQuery,
} from "@/types";
import { useMemo } from "react";
import { useIncentive } from "./incentives";
import { useGraphClient, useWeb3 } from "./web3";

export const useUserIncentivePositions = (incentiveId: string) => {
  const [incentive, incentiveLoading] = useIncentive(incentiveId);
  const [positions, positionsLoading] = useUserPoolPositions(
    incentive?.pool.id
  );
  return [positions, incentiveLoading || positionsLoading] as const;
};

export const useUserPoolPositions = (poolId?: string) => {
  const { address } = useWeb3();
  const client = useGraphClient();
  const { data: stakerData, loading: stakerLoading } =
    useGetStakerPositionsQuery({
      variables: { where: { owner: address || "" } },
      client,
    });
  const id_in = stakerData?.positions.map((p) => p.tokenId) || [];
  const { data, loading } = useGetPositionsQuery({
    variables: {
      where: { or: [{ pool: poolId || "", owner: address || "" }, { id_in }] },
    },
  });
  const result = useMemo(() => {
    if (!data || !stakerData) return;
    const positions = data.positions.map((p) => {
      const stakerPosition = stakerData.positions.find(
        (sp) => sp.tokenId === p.id
      );
      return {
        ...stakerPosition,
        ...p,
        deposited: p.owner !== stakerPosition?.owner,
      };
    });
    return positions as IPosition[];
  }, [data, stakerData]);
  return [result, loading || stakerLoading] as const;
};
