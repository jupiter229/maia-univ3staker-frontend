import { IIncentive, IPosition, Incentiveish } from "@/types";
import { encodeAbiParameters, parseAbiParameters } from "viem";

export const getIncentiveStruct = (incentive: Incentiveish) => {
  const { rewardToken, pool } = incentive;
  return {
    rewardToken: typeof rewardToken === "string" ? rewardToken : rewardToken.id,
    pool: typeof pool === "string" ? pool : pool.id,
    startTime: incentive.startTime,
    endTime: incentive.endTime,
    minWidth: incentive.minWidth,
    refundee: incentive.refundee,
  };
};

export const encodeIncentive = (incentive: IIncentive) => {
  return encodeAbiParameters(
    parseAbiParameters("address, address, uint256, uint256, address"),
    [
      incentive.rewardToken.id,
      incentive.pool.id,
      incentive.startTime,
      incentive.endTime,
      incentive.refundee,
    ]
  );
};

export const fallbackPositionIncentiveId = (
  position: IPosition,
  incentiveId?: string
) => {
  return incentiveId === undefined ? position.incentive?.id || "" : incentiveId;
};

export const formatAddress = (address?: string) => {
  return `${address?.substring(0, 6)}...${address?.substring(
    address?.length - 6
  )}`;
};
