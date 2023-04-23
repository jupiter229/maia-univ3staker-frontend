import {
  useDepositStake,
  useIncentive,
  useStake,
  useUnstake,
  useWithdraw,
} from "@/hooks";
import { IPosition, Incentiveish } from "@/types";
import { fallbackPositionIncentiveId } from "@/utils";
import { useMemo } from "react";
import { Button } from "../Button";

interface IProps {
  incentiveId?: string;
  position: IPosition;
}

export const ActionButtons: React.FC<IProps> = ({
  position,
  incentiveId: id,
}) => {
  const incentiveId = fallbackPositionIncentiveId(position, id);
  const [incentive, incentiveLoading] = useIncentive(incentiveId);
  const unstakeInput = useMemo(
    () =>
      id && incentive
        ? incentive
        : (position.stakedIncentives
            .map((i) => i.incentive)
            .filter(Boolean) as Incentiveish[]),
    [id, incentive, position.stakedIncentives]
  );
  const onUnstake = useUnstake(unstakeInput);
  const onDepositStake = useDepositStake(incentiveId);
  const onStake = useStake(incentiveId);
  const onWithdraw = useWithdraw(incentiveId);
  const hasExpired = incentive?.endTime * 1000 <= Date.now();
  // TODO: remove this when we have a way to check if a position is staked in an incentive
  // const [isStakedInIncentive, isStakedInIncentiveLoading] =
  //   useIsStakedInIncentive(position.id, incentiveId);
  // const loading = isStakedInIncentiveLoading || incentiveLoading;
  const isStakedInIncentive = position.stakedIncentives.find(
    (i) => i.incentive?.id === incentiveId
  );
  const loading = incentiveLoading;
  return loading ? null : (
    <div className="flex justify-center gap-4">
      {isStakedInIncentive ? (
        <Button
          className="w-full max-w-[200px]"
          onClick={() => onUnstake(position.id)}
        >
          Unstake & Claim
        </Button>
      ) : position.deposited ? (
        <>
          {hasExpired || (
            <Button
              className="w-full max-w-[200px]"
              onClick={() => onStake(position.id)}
            >
              Stake
            </Button>
          )}
          <Button
            className="w-full max-w-[200px]"
            onClick={() => onWithdraw(position.id)}
          >
            Withdraw
          </Button>
        </>
      ) : hasExpired ? (
        <p>The incentive has ended</p>
      ) : (
        <Button
          className="w-full max-w-[200px]"
          onClick={() => onDepositStake(position.id)}
        >
          Stake
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
