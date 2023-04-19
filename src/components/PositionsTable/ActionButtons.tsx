import {
  useDepositStake,
  useIncentive,
  useIsStakedInIncentive,
  useStake,
  useUnstake,
  useWithdraw,
} from "@/hooks";
import { IPosition } from "@/types";
import { Button } from "../Button";

interface IProps {
  incentiveId: string;
  position: IPosition;
}

export const ActionButtons: React.FC<IProps> = ({ position, incentiveId }) => {
  const onDepositStake = useDepositStake(incentiveId);
  const onUnstake = useUnstake(incentiveId);
  const onStake = useStake(incentiveId);
  const onWithdraw = useWithdraw(incentiveId);
  const [isStakedInIncentive, isStakedInIncentiveLoading] =
    useIsStakedInIncentive(position.id, incentiveId);
  const [incentive, incentiveLoading] = useIncentive(incentiveId);
  const loading = isStakedInIncentiveLoading || incentiveLoading;
  const hasExpired = incentive?.endTime * 1000 <= Date.now();
  return loading ? null : (
    <div className="flex justify-center gap-4">
      {position.staked ? (
        isStakedInIncentive ? (
          <Button
            className="w-full max-w-[200px]"
            onClick={() => onUnstake(position.id)}
          >
            Unstake & Claim
          </Button>
        ) : (
          <p>Position staked in another incentive</p>
        )
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
