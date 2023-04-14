import { Contracts, UniswapV3StakerABI } from "@/config";
import { useCallback } from "react";
import { useIncentive } from "./incentives";
import { useChainContract } from "./web3";

export const useStakerContract = () => {
  return useChainContract(Contracts.staker, UniswapV3StakerABI);
};

export const useStake = (incentiveId?: string) => {
  const staker = useStakerContract();
  const [incentive, unavailable] = useIncentive(incentiveId || "");

  const stake = useCallback(
    async (nftId: string | number) => {
      const data = {
        rewardToken: incentive?.rewardToken.id,
        pool: incentive?.pool.id,
        startTime: incentive?.startTime,
        endTime: incentive?.endTime,
        refundee: incentive?.refundee,
        minWidth: incentive?.minWidth,
      };
      const tx = await staker?.stakeToken(data, nftId.toString() || "");
      return tx.wait();
    },
    [incentive, staker]
  );

  return [stake, unavailable] as const;
};
