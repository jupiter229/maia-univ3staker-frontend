// @ts-nocheck
import { useWeb3 } from "@/hooks";
import { IPosition } from "@/types";
import { formatDateDiff, formatUSD } from "@/utils";
import Link from "next/link";
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
        Header: "Position Value",
        accessor: "value",
        Cell: ({ value }) =>
          formatUSD(
            (data[0].liquidity / data[0].pool.liquidity) *
              data[0].pool.totalValueLockedUSD
          ),
      },
      {
        Header: "",
        accessor: "stake",
        Cell: ({ row: { original } }) => (
          <ActionButtons incentiveId={incentiveId} position={original} />
        ),
      },
    ],
    [incentiveId, data]
  );
  console.log(data);
  return (
    <div className="flex flex-col gap-4 justify-center items-center text-white w-full">
      {title && (
        <h5 className="text-lg font-semibold px-6 w-full grid grid-cols-5 gap-4">
          {title}{" "}
          <Link
            type="button"
            target="_blank"
            href={
              data !== undefined
                ? "https://uni.maiadao.io/#/add/" +
                  data[0].pool.token0.id +
                  "/" +
                  data[0].pool.token1.id +
                  "/" +
                  data[0].pool.feeTier
                : "."
            }
            className="text-white col-start-5 bg-gradient-to-br from-purple-800 to-blue-800 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg py-2.5 text-center"
          >
            Add Liquidity
          </Link>
        </h5>
      )}
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
