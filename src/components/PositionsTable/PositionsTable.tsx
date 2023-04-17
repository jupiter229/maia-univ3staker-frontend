// @ts-nocheck
import { MetaMask } from "@/config";
import { useWeb3 } from "@/hooks";
import { PositionFieldsFragment } from "@/types";
import { formatBigNumber, formatDateDiff } from "@/utils";
import { useMemo } from "react";
import { useConnect } from "wagmi";
import { Button } from "../Button";
import { Table } from "../Table";

interface IProps {
  data?: PositionFieldsFragment[];
  hasExpired?: boolean;
  onStake?: (nftId: string | number) => Promise<any>;
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

export const PositionsTable: React.FC<IProps> = ({
  data,
  onStake,
  hasExpired,
}) => {
  const { account } = useWeb3();
  const { connect } = useConnect();
  const columns = useMemo(
    () => [
      ...staticColumns,
      {
        Header: "",
        accessor: "stake",
        Cell: ({ row: { original: value } }) => (
          <div className="flex justify-center">
            {hasExpired ? (
              <p>The incentive has ended</p>
            ) : (
              <Button
                className="w-full max-w-[200px]"
                onClick={() => onStake?.(value.id)}
              >
                Stake
              </Button>
            )}
          </div>
        ),
      },
    ],
    [hasExpired, onStake]
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
