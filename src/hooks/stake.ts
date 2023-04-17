import { Contracts, PositionManagerABI, UniswapV3StakerABI } from "@/config";
import { PositionManager, UniswapV3Staker } from "@/types";
import { encodeIncentive } from "@/utils";
import { useCallback } from "react";
import { useIncentive } from "./incentives";
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

export const useStake = (incentiveId: string) => {
  const { account } = useWeb3();
  const staker = useStakerContract();
  const positionManager = usePositionManagerContract();
  const [incentive] = useIncentive(incentiveId);

  const stake = useCallback(
    async (nftId: string | number) => {
      if (!positionManager) throw "No position manager";
      if (!incentive) throw "No incentive";
      if (!staker) throw "No staker";
      if (!account) throw "No account";
      const tx = await positionManager[
        "safeTransferFrom(address,address,uint256,bytes)"
      ](account, staker.address, nftId.toString(), encodeIncentive(incentive));
      return tx.wait();
    },
    [account, incentive, positionManager, staker]
  );

  return stake;
};
