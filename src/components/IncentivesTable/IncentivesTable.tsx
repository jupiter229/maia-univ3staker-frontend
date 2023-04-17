// @ts-nocheck
import { IIncentive } from "@/types";
import { formatBigNumber, formatDateTime, formatUSD } from "@/utils";
import { BigNumber } from "ethers";
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
      <Link href={`/${pool.id}/${original.id}`}>
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
  {
    Header: "Reward Token",
    accessor: "reward",
    Cell: ({ row: { original: row } }) => row.rewardToken.symbol,
  },
  {
    Header: "Total Reward",
    accessor: "totalReward",
    Cell: ({ row: { original: row } }) => (
      <>
        <p>
          {formatBigNumber(row.reward)} {row.rewardToken.symbol}
        </p>
        <p>
          {formatUSD(
            BigNumber.from(row.reward)
              .mul(row.rewardToken.volumeUSD)
              .div(BigNumber.from(row.rewardToken.volume).add(1))
              .toNumber()
          )}
        </p>
      </>
    ),
  },
];

export const IncentivesTable: React.FC<IProps> = ({ data }) => {
  return <Table columns={columns} data={data || []} title="Incentives" />;
};

export default IncentivesTable;
