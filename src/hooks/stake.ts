import { Contracts, PositionManagerABI, UniswapV3StakerABI } from "@/config";
import { Arrayable, Incentiveish } from "@/types";
import { arrayify, encodeIncentive, getIncentiveStruct } from "@/utils";
import { useCallback, useMemo } from "react";
import { encodeFunctionData, getAddress } from "viem";
import { useContractReads, useContractWrite } from "wagmi";
import { useIncentive } from "./incentives";
import { useWeb3 } from "./web3";

const stakerContract = {
  address: getAddress(Contracts.staker[1088]),
  abi: UniswapV3StakerABI,
};

export const useStakerContractWriteMulticall = (chainId: number) => {
  return useContractWrite({
    ...stakerContract,
    chainId: chainId,
    functionName: "multicall",
  });
};

export const useStakerContractWriteStake = (chainId: number) => {
  return useContractWrite({
    ...stakerContract,
    chainId: chainId,
    functionName: "stakeToken",
  });
};

export const useStakerContractWriteWithdraw = (chainId: number) => {
  return useContractWrite({
    ...stakerContract,
    chainId: chainId,
    functionName: "withdrawToken",
  });
};

// export const useStakerContractWriteClaimReward = (chainId: number) => {
//   return useContractWrite({
//   ...stakerContract,
//     chainId: chainId,
//     functionName: "claimReward",
//   });
// };

const usePositionManagerContractWriteSafeTransferFrom = (chainId: number) => {
  return useContractWrite({
    address: getAddress(Contracts.positionManager[1088]),
    abi: PositionManagerABI,
    chainId: chainId,
    functionName: "safeTransferFrom",
  });
};

const getCallsGetRewardInfo = (args: { incentive: any; tokenId: number }[]) => {
  return args.map((arg) => {
    return {
      ...stakerContract,
      functionName: "getRewardInfo",
      args: [arg.incentive, arg.tokenId],
    };
  });
};

const useContractReadsGetRewardInfo = (
  args: { incentive: any; tokenId: number }[]
) => {
  return useContractReads({
    contracts: getCallsGetRewardInfo(args) as any,
    watch: true as any,
  });
};

export const useDepositStake = (incentiveId: string) => {
  const { account, chainId } = useWeb3();
  const { data, isLoading, isSuccess, write } =
    usePositionManagerContractWriteSafeTransferFrom(chainId);
  const [incentive] = useIncentive(incentiveId);

  const stake = useCallback(
    async (nftId: string | number) => {
      if (!write) throw "No position manager";
      if (!incentive) throw "No incentive";
      if (!account) throw "No account";

      write({
        args: [
          account,
          getAddress(Contracts.staker[1088]),
          nftId.toString(),
          encodeIncentive(incentive),
        ],
      });
      return isSuccess ? data : isLoading;
    },
    [write, incentive, account, isSuccess, data, isLoading]
  );

  return stake;
};

export const useStake = (incentiveId: string) => {
  const { account, chainId } = useWeb3();
  const { data, isLoading, isSuccess, write } =
    useStakerContractWriteStake(chainId);
  const [incentive] = useIncentive(incentiveId);

  const stake = useCallback(
    async (nftId: string | number) => {
      if (!incentive) throw "No incentive";
      if (!write) throw "No staker";
      if (!account) throw "No account";

      write({
        args: [getIncentiveStruct(incentive), nftId.toString()],
      });
      return isSuccess ? data : isLoading;
    },
    [account, data, incentive, isLoading, isSuccess, write]
  );

  return stake;
};

export const useWithdraw = (incentiveId: string) => {
  const { account, chainId } = useWeb3();
  const { data, isLoading, isSuccess, write } =
    useStakerContractWriteWithdraw(chainId);
  const [incentive] = useIncentive(incentiveId);

  const withdraw = useCallback(
    async (nftId: string | number) => {
      if (!incentive) throw "No incentive";
      if (!write) throw "No staker";
      if (!account) throw "No account";

      write({ args: [nftId.toString(), account, encodeIncentive(incentive)] });
      return isSuccess ? data : isLoading;
    },
    [account, data, incentive, isLoading, isSuccess, write]
  );

  return withdraw;
};

export const useUnstake = (incentives: Arrayable<Incentiveish>) => {
  const { account, chainId } = useWeb3();
  const { data, isLoading, isSuccess, write } =
    useStakerContractWriteMulticall(chainId);

  const unstake = useCallback(
    async (nftId: string | number) => {
      if (!incentives || (Array.isArray(incentives) && !incentives))
        throw "No incentive";
      if (!write) throw "No staker";
      if (!account) throw "No account";

      const calls = arrayify(incentives)
        .map((incentive) => {
          const incentiveStruct = getIncentiveStruct(incentive);
          const rewardToken = incentiveStruct.rewardToken;
          return [
            encodeFunctionData({
              abi: UniswapV3StakerABI,
              functionName: "unstakeToken",
              args: [incentiveStruct, nftId.toString()],
            }),
            encodeFunctionData({
              abi: UniswapV3StakerABI,
              functionName: "claimReward",
              args: [rewardToken, account, 0],
            }),
          ];
        })
        .flat();

      write({ args: [calls] });

      return isSuccess ? data : isLoading;
    },
    [account, data, incentives, isLoading, isSuccess, write]
  );

  return unstake;
};

// export const useIncentiveRewards = (incentiveId: string) => {
//   const { account, chainId } = useWeb3();
//   const { data, isLoading, isSuccess, write } =
//     useStakerContractWriteClaimReward(chainId);
//   const [incentive] = useIncentive(incentiveId);
//   const [rewards, setRewards] = useState<BigNumber>(BigNumber.from(0));

//   const claimRewards = useCallback(async () => {
//     if (!incentive) throw "No incentive";
//     if (!write) throw "No staker";
//     if (!account) throw "No account";

//     write({ args: [incentive.rewardToken.id, account, 0] });

//     return isSuccess ? data : isLoading;
//   }, [account, data, incentive, isLoading, isSuccess, write]);

//   useEffect(() => {
//     if (!incentive || !staker || !account) return;
//     staker.rewards(incentive.rewardToken.id, account).then(setRewards);
//   }, [account, incentive, staker]);

//   return { ...incentive?.rewardToken, rewards, claimRewards };
// };

type Reward = {
  result: number[] | null;
};

type Data = Reward[];

export const useIncentiveRewards = (
  args: { incentive: any; tokenId: number }[]
) => {
  const { data, isError, isLoading } = useContractReadsGetRewardInfo(
    args.map((arg) => ({
      incentive: getIncentiveStruct(arg.incentive),
      tokenId: arg.tokenId,
    }))
  );

  const result = useMemo(() => {
    if (!args || isError || !data) return;

    return isLoading
      ? []
      : (data as Data).map((rewards, i) => {
          return rewards.result === undefined || rewards.result === null
            ? 0
            : Number(rewards.result[0]);
        });
  }, [args, data, isError, isLoading]);

  return result;
};
