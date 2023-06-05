// @ts-nocheck
import { IIncentive } from "@/types";
import { formatBigNumber, formatDateTime, formatUSD } from "@/utils";
import Link from "next/link";
import { Table } from "../Table";

interface IProps {
  data?: IIncentive[];
}

const columns = [
  {
    Header: "Pool",
    accessor: "pool",
    Cell: ({ value: pool, row: { original } }) => (
      <Link href={`/${original.id}`}>
        {pool.token0.symbol}/{pool.token1.symbol}
      </Link>
    ),
  },
  {
    Header: "Duration",
    accessor: "duration",
    Cell: ({ row: { original: row } }) => (
      <>
        <p>{formatDateTime(row.startTime * 1000)}</p>
        <p>{formatDateTime(row.endTime * 1000)}</p>
      </>
    ),
  },
  {
    Header: "TVL",
    accessor: "tvl",
    Cell: ({ row: { original: row } }) =>
      formatUSD(row.pool.totalValueLockedUSD),
  },
  // {
  //   Header: "MinWidth",
  //   accessor: "minWidth",
  // },
  // {
  //   Header: "Reward Token",
  //   accessor: "reward",
  //   Cell: ({ row: { original: row } }) => row.rewardToken.symbol,
  // },
  {
    Header: "Total Reward",
    accessor: "totalReward",
    Cell: ({ row: { original: row } }) => (
      <>
        <p>
          {formatBigNumber(row.reward)} {row.rewardToken.symbol}
        </p>
      </>
    ),
  },
  {
    Header: "24H Fee",
    accessor: "24Fee",
    Cell: ({ row: { original: row } }) => (
      <>
        <p>{formatUSD(row.poolDayData.feesUSD * 0.9)}</p>
      </>
    ),
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ row: { original: row } }) => {
      const now = Date.now();
      if (now < row.startTime * 1000) {
        return "Upcoming";
      }
      if (now > row.endTime * 1000) {
        return "Ended";
      }
      return "Active";
    },
  },
];

export const IncentivesTable: React.FC<IProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center text-white w-full">
      <h5 className="text-lg font-semibold px-6 w-full">Incentives</h5>
      <Table columns={columns} data={data || []} />
    </div>
  );
};

export default IncentivesTable;
