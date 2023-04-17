import { IIncentive } from "@/types";
import { defaultAbiCoder } from "ethers/lib/utils.js";

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
