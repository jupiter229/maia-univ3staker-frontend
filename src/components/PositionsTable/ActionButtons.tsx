import {
  useClaimRewards,
  useDepositStake,
  useStake,
  useUnstake,
  useWithdraw,
} from "@/hooks";
import { IIncentive, IPosition, Incentiveish } from "@/types";
import { useMemo } from "react";
import { Button } from "../Button";

interface IProps {
  incentive?: IIncentive;
  position: IPosition;
}

export const ActionButtons: React.FC<IProps> = ({ position, incentive }) => {
  const unstakeInput = useMemo(
    () =>
      !!incentive
        ? incentive
        : (position.stakedIncentives
            .map((i: any) => i.incentive)
            .filter(Boolean) as Incentiveish[]),
    [incentive, position.stakedIncentives]
  );
  const onUnstake = useUnstake(unstakeInput);
  const onClaim = useClaimRewards(unstakeInput);
  const onDepositStake = useDepositStake(incentive);
  const onStake = useStake(incentive);
  const onWithdraw = useWithdraw();
  const hasExpired = incentive?.endTime * 1000 <= Date.now();

  const isStakedInIncentive = position.stakedIncentives.find(
    (i: any) => i.incentive?.id === incentive?.id
  );

  return (
    <div className="flex justify-center gap-4">
      {isStakedInIncentive ? (
        <>
          <Button
            className="w-full max-w-[200px]"
            onClick={() => onClaim(position.id)}
          >
            Claim
          </Button>
          <Button
            className="w-full max-w-[200px]"
            onClick={() => onUnstake(position.id)}
          >
            Unstake & Claim
          </Button>
        </>
      ) : position.deposited ? (
        <>
          {hasExpired ||
            (!!incentive && (
              <Button
                className="w-full max-w-[200px]"
                onClick={() => onStake(position.id)}
              >
                Stake
              </Button>
            ))}
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
