import { Contracts, PositionManagerABI, UniswapV3StakerABI } from "@/config";
import { PositionManager, UniswapV3Staker } from "@/types";
import { useCallback } from "react";
import { useContract, useWeb3 } from "./web3";

export const useStakerContract = () => {
  return useContract<UniswapV3Staker>(Contracts.staker, UniswapV3StakerABI);
};

export const usePositionManagerContract = () => {
  return useContract<PositionManager>(
    Contracts.positionManager,
    PositionManagerABI
  );
};

export const useStake = (incentiveId?: string) => {
  const { account } = useWeb3();
  const staker = useStakerContract();
  const positionManager = usePositionManagerContract();

  const stake = useCallback(
    async (nftId: string | number) => {
      if (!positionManager) throw "No position manager";
      if (!staker) throw "No staker";
      if (!account) throw "No account";
      const tx = await (incentiveId
        ? positionManager["safeTransferFrom(address,address,uint256,bytes)"](
            account,
            staker.address,
            nftId.toString(),
            incentiveId
          )
        : positionManager["safeTransferFrom(address,address,uint256)"](
            account,
            staker.address,
            nftId.toString()
          ));
      return tx.wait();
    },
    [account, incentiveId, positionManager, staker]
  );

  return stake;
};

// export const useStake = (incentiveId?: string) => {
//   const staker = useStakerContract();
//   const [incentive, unavailable] = useIncentive(incentiveId || "");

//   const stake = useCallback(
//     async (nftId: string | number) => {
//       if (!staker || !incentive) throw "No staker or incentive";
//       const data = {
//         rewardToken: incentive?.rewardToken.id,
//         pool: incentive?.pool.id,
//         startTime: incentive?.startTime,
//         endTime: incentive?.endTime,
//         refundee: incentive?.refundee,
//         minWidth: incentive?.minWidth,
//       };
//       const tx = await staker.stakeToken(data, nftId.toString());
//       return tx.wait();
//     },
//     [incentive, staker]
//   );

//   return [stake, unavailable] as const;
// };
