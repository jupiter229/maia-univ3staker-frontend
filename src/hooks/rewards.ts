import { WHITELISTED_REWARDS, ZERO_ADDRESS } from "@/config/constants/const";
import { useMemo } from "react";
import { useUserTokenRewards } from "./stake";
import { useWeb3 } from "./web3";

export const useUserRewards = () => {
  const { address } = useWeb3();

  const rewards = useUserTokenRewards(
    WHITELISTED_REWARDS.map((token) => ({
      rewardToken: token,
      user: address ?? ZERO_ADDRESS,
    })) ?? []
  );

  return useMemo(() => {
    return {
      rewards:
        rewards
          ?.map((amount, i) => ({
            token: WHITELISTED_REWARDS[i],
            rewardAmount: amount,
          }))
          .filter((r) => r.rewardAmount > 0) ?? [],
    } as const;
  }, [rewards]);
};
