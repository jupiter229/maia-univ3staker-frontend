// @ts-nocheck
import { useWeb3 } from "@/hooks";
import { IPosition } from "@/types";
import { formatBigInt, formatDateDiff } from "@/utils";
import { useMemo } from "react";
import { ConnectWallet } from "../ConnectWallet";
import { Table } from "../Table";
import { ActionButtons } from "./ActionButtons";

interface IProps {
  incentiveId?: string;
  data?: IPosition[];
  hasExpired?: boolean;
  title?: string;
}

const staticColumns = [
  {
    Header: "NFT",
    accessor: "id",
  },
  {
    Header: "Liquidity",
    accessor: "liquidity",
    Cell: ({ value }) => formatBigInt(value),
  },
  {
    Header: "Position Age",
    accessor: "transaction",
    Cell: ({ value }) => formatDateDiff(value.timestamp * 1000),
  },
];

export const PositionsTable: React.FC<IProps> = ({
  data,
  incentiveId,
  title = "My Positions",
}) => {
  const { account } = useWeb3();
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
  return (
    <div className="flex flex-col gap-4 justify-center items-center text-white w-full">
      {title && <h5 className="text-lg font-semibold px-6 w-full">{title}</h5>}
      {account ? (
        <Table columns={columns} data={data || []} />
      ) : (
        <>
          <p>Connect your wallet to view your positions</p>
          <ConnectWallet />
        </>
      )}
    </div>
  );
};

export default PositionsTable;
