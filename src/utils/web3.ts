import { IIncentive } from "@/types";
import { defaultAbiCoder } from "ethers/lib/utils.js";

export const getIncentiveStruct = (incentive: IIncentive) => {
  return {
    rewardToken: incentive.rewardToken.id,
    pool: incentive.pool.id,
    startTime: incentive.startTime,
    endTime: incentive.endTime,
    minWidth: incentive.minWidth,
    refundee: incentive.refundee,
  };
};

export const encodeIncentive = (incentive: IIncentive) => {
  return defaultAbiCoder.encode(
    ["address", "address", "uint256", "uint256", "int24", "address"],
    [
      incentive.rewardToken.id,
      incentive.pool.id,
      incentive.startTime,
      incentive.endTime,
      incentive.minWidth,
      incentive.refundee,
    ]
  );
};

export const getDisplayAddress = (account?: string) => {
  return `${account?.substring(0, 6)}...${account?.substring(
    account?.length - 6
  )}`;
};
