import { Contracts, PositionManagerABI, UniswapV3StakerABI } from "@/config";
import { PositionManager, UniswapV3Staker } from "@/types";
import { encodeIncentive, getIncentiveStruct } from "@/utils";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
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

export const useDepositStake = (incentiveId: string) => {
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

export const useStake = (incentiveId: string) => {
  const { account } = useWeb3();
  const staker = useStakerContract();
  const [incentive] = useIncentive(incentiveId);

  const stake = useCallback(
    async (nftId: string | number) => {
      if (!incentive) throw "No incentive";
      if (!staker) throw "No staker";
      if (!account) throw "No account";

      const tx = await staker.stakeToken(
        getIncentiveStruct(incentive),
        nftId.toString()
      );

      return tx.wait();
    },
    [account, incentive, staker]
  );

  return stake;
};

export const useWithdraw = (incentiveId: string) => {
  const { account } = useWeb3();
  const staker = useStakerContract();
  const [incentive] = useIncentive(incentiveId);

  const withdraw = useCallback(
    async (nftId: string | number) => {
      if (!incentive) throw "No incentive";
      if (!staker) throw "No staker";
      if (!account) throw "No account";
      const tx = await staker.withdrawToken(
        nftId.toString(),
        account,
        encodeIncentive(incentive)
      );
      return tx.wait();
    },
    [account, incentive, staker]
  );

  return withdraw;
};

export const useUnstake = (incentiveId: string) => {
  const { account } = useWeb3();
  const staker = useStakerContract();
  const [incentive] = useIncentive(incentiveId);

  const unstake = useCallback(
    async (nftId: string | number) => {
      if (!incentive) throw "No incentive";
      if (!staker) throw "No staker";
      if (!account) throw "No account";
      const tx = await staker.unstakeToken(
        getIncentiveStruct(incentive),
        nftId.toString()
      );
      return tx.wait();
    },
    [account, incentive, staker]
  );

  return unstake;
};

export const useIncentiveRewards = (incentiveId: string) => {
  const { account } = useWeb3();
  const staker = useStakerContract();
  const [incentive] = useIncentive(incentiveId);
  const [rewards, setRewards] = useState<BigNumber>(BigNumber.from(0));

  const claimRewards = useCallback(async () => {
    if (!incentive) throw "No incentive";
    if (!staker) throw "No staker";
    if (!account) throw "No account";
    const tx = await staker.claimReward(incentive.rewardToken.id, account, 0);
    return tx.wait();
  }, [account, incentive, staker]);

  useEffect(() => {
    if (!incentive || !staker || !account) return;
    staker.rewards(incentive.rewardToken.id, account).then(setRewards);
  }, [account, incentive, staker]);

  return { ...incentive?.rewardToken, rewards, claimRewards };
};
