// @ts-nocheck
import { MetaMask } from "@/config";
import {
  useDepositStake,
  useIncentive,
  useStake,
  useUnstake,
  useWeb3,
  useWithdraw,
} from "@/hooks";
import { IPosition } from "@/types";
import { formatBigNumber, formatDateDiff } from "@/utils";
import { useMemo } from "react";
import { useConnect } from "wagmi";
import { Button } from "../Button";
import { Table } from "../Table";

interface IProps {
  incentiveId: string;
  data?: IPosition[];
  hasExpired?: boolean;
}

const staticColumns = [
  {
    Header: "NFT",
    accessor: "id",
  },
  {
    Header: "Liquidity",
    accessor: "liquidity",
    Cell: ({ value }) => formatBigNumber(value),
  },
  {
    Header: "Age",
    accessor: "transaction",
    Cell: ({ value }) => formatDateDiff(value.timestamp * 1000),
  },
];

export const PositionsTable: React.FC<IProps> = ({ data, incentiveId }) => {
  const { account } = useWeb3();
  const { connect } = useConnect();
  const onDepositStake = useDepositStake(incentiveId);
  const onUnstake = useUnstake(incentiveId);
  const onStake = useStake(incentiveId);
  const onWithdraw = useWithdraw(incentiveId);
  const [incentive] = useIncentive(incentiveId);
  const hasExpired = incentive?.endTime * 1000 <= Date.now();
  const columns = useMemo(
    () => [
      ...staticColumns,
      {
        Header: "",
        accessor: "stake",
        Cell: ({ row: { original: value } }) => (
          <div className="flex justify-center gap-4">
            {value.staked ? (
              <Button
                className="w-full max-w-[200px]"
                onClick={() => onUnstake(value.id)}
              >
                Unstake & Claim
              </Button>
            ) : value.deposited ? (
              <>
                {hasExpired || (
                  <Button
                    className="w-full max-w-[200px]"
                    onClick={() => onStake(value.id)}
                  >
                    Stake
                  </Button>
                )}
                <Button
                  className="w-full max-w-[200px]"
                  onClick={() => onWithdraw(value.id)}
                >
                  Withdraw
                </Button>
              </>
            ) : hasExpired ? (
              <p>The incentive has ended</p>
            ) : (
              <Button
                className="w-full max-w-[200px]"
                onClick={() => onDepositStake(value.id)}
              >
                Stake
              </Button>
            )}
          </div>
        ),
      },
    ],
    [hasExpired, onDepositStake, onStake, onUnstake, onWithdraw]
  );
  return account ? (
    <Table columns={columns} data={data || []} title="My Positions" />
  ) : (
    <div className="flex flex-col gap-4 justify-center items-center">
      <h5 className="text-white text-lg font-semibold px-6">My Positions</h5>
      <Button onClick={() => connect({ connector: MetaMask })}>
        Connect Wallet
      </Button>
    </div>
  );
};

export default PositionsTable;
