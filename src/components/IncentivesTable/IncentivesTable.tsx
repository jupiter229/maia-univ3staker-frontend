import { IIncentive } from "@/types";
import { formatBigNumber, formatDateTime, formatUSD } from "@/utils";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { BigNumber } from "ethers";
import Link from "next/link";

interface IProps {
  data?: IIncentive[];
}

export const IncentivesTable: React.FC<IProps> = ({ data }) => {
  return (
    <TableContainer component={Paper} sx={{ minWidth: 700, maxWidth: 1200 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Pool</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>TVL</TableCell>
            <TableCell>Reward</TableCell>
            <TableCell>Total Reward</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                <Link href={`/${row.pool?.id}/${row.id}`}>
                  {row.pool?.token0.symbol}/{row.pool?.token1?.symbol}
                </Link>
              </TableCell>
              <TableCell>
                <p>{formatDateTime(row.startTime * 1000)}</p>
                <p>{formatDateTime(row.endTime * 1000)}</p>
              </TableCell>
              <TableCell>{formatUSD(row.pool?.totalValueLockedUSD)}</TableCell>
              <TableCell>{row.rewardToken?.symbol}</TableCell>
              <TableCell>
                <p>
                  {formatBigNumber(row.reward)} {row.rewardToken?.symbol}
                </p>
                <p>
                  {formatUSD(
                    BigNumber.from(row.reward)
                      .mul(row.rewardToken?.volumeUSD)
                      .div(BigNumber.from(row.rewardToken?.volume).add(1))
                      .toNumber()
                  )}
                </p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
