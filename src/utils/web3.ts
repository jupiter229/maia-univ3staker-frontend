import { IIncentive, Incentiveish } from "@/types";
import { encodeAbiParameters, getAddress, parseAbiParameters } from "viem";

export const getIncentiveStruct = (incentive: Incentiveish) => {
  if (!incentive) return null;
  const { rewardToken, pool } = incentive;
  return {
    rewardToken: getAddress(
      typeof rewardToken === "string" ? rewardToken : rewardToken.id
    ),
    pool: getAddress(typeof pool === "string" ? pool : pool.id),
    startTime: incentive.startTime,
    endTime: incentive.endTime,
    refundee: getAddress(incentive.refundee),
  };
};

export const encodeIncentive = (incentive: IIncentive) => {
  return encodeAbiParameters(
    parseAbiParameters(
      "address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee"
    ),
    [
      getAddress(incentive.rewardToken.id),
      getAddress(incentive.pool.id),
      incentive.startTime,
      incentive.endTime,
      getAddress(incentive.refundee),
    ]
  );
};
