import { useGetPositionsQuery } from "@/types";
import { useWeb3 } from "./web3";

export const useUserPoolPositions = (poolId?: string) => {
  const { address } = useWeb3();
  const { data, loading } = useGetPositionsQuery({
    variables: { where: { pool: poolId || "", owner: address || "" } },
  });
  return [data?.positions, loading] as const;
};
