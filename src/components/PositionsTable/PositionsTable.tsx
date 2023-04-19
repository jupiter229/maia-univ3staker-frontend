// @ts-nocheck
import { MetaMask } from "@/config";
import { useWeb3 } from "@/hooks";
import { IPosition } from "@/types";
import { formatBigNumber, formatDateDiff } from "@/utils";
import { useMemo } from "react";
import { useConnect } from "wagmi";
import { Button } from "../Button";
import { Table } from "../Table";
import { ActionButtons } from "./ActionButtons";

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
  const columns = useMemo(
    () => [
      ...staticColumns,
      {
        Header: "",
        accessor: "stake",
        Cell: ({ row: { original } }) => (
          <ActionButtons incentiveId={incentiveId} position={original} />
        ),
      },
    ],
    [incentiveId]
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
