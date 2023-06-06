// @ts-nocheck
import { TICK_INCREMENT, YEAR } from "@/config/constants/const";
import { IIncentive } from "@/types";
import { formatBigInt, formatDateTime, formatUSD } from "@/utils";
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
  {
    Header: "Minimum Range",
    accessor: "minWidth",
    Cell: ({ row: { original: row } }) => (
      <>
        <p>±{row.minWidth * TICK_INCREMENT}%</p>
        <p>
          {row.minWidth} {row.minWidth == 1 ? "Tick" : "Ticks"}
        </p>
      </>
    ),
  },
  {
    Header: "Total Rewards And Fees",
    accessor: "totalRewards",
    Cell: ({ row: { original: row } }) => (
      <>
        <p>
          {formatBigInt(row.reward, {
            decimals: row.rewardToken.decimals,
            precision: 2,
          })}{" "}
          {row.rewardToken.symbol}
        </p>
        <p>{formatUSD(row.poolDayData.feesUSD * 0.9)} fees previous 24H</p>
      </>
    ),
  },
  {
    Header: "Reward APR",
    accessor: "rewardapr",
    Cell: ({ row: { original: row } }) => (
      <>
        <p>
          {(row.tokenPriceUSD > 0 &&
            row.fullRangeLiquidityUSD > 0 &&
            (
              ((formatBigInt(row.reward) * row.tokenPriceUSD) /
                row.fullRangeLiquidityUSD) *
              (YEAR / (row.endTime - row.startTime)) *
              100
            ).toFixed(2)) ||
            0}
          % -{" "}
          {(row.tokenPriceUSD > 0 &&
            row.activeLiqudityUSD > 0 &&
            (
              ((formatBigInt(row.reward) * row.tokenPriceUSD) /
                row.activeLiqudityUSD) *
              (YEAR / (row.endTime - row.startTime)) *
              100
            ).toFixed(2)) ||
            0}
          %
        </p>
      </>
    ),
  },
  {
    Header: "Fee APR",
    accessor: "feeapr",
    Cell: ({ row: { original: row } }) => (
      <>
        <p>
          {(row.poolDayData.feesUSD > 0 &&
            row.fullRangeLiquidityUSD > 0 &&
            (
              ((row.poolDayData.feesUSD * 0.9 * 365) /
                row.fullRangeLiquidityUSD) *
              100
            ).toFixed(2)) ||
            0}
          % -{" "}
          {(row.poolDayData.feesUSD > 0 &&
            row.activeLiqudityUSD > 0 &&
            (
              ((row.poolDayData.feesUSD * 0.9 * 365) / row.activeLiqudityUSD) *
              100
            ).toFixed(2)) ||
            0}
          %
        </p>
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
  // {
  //   Header: "Status",
  //   accessor: "statsss",
  //   Cell: ({ row: { original: row } }) => {
  //     <>
  //       { Date.now() < row.startTime *1000 && }
  //     </>;
  //     <>
  //       <p></p>
  //     </>;
  //   },
  // },
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
