import { PositionFieldsFragment } from "@/types";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { PositionRow } from "./PositionRow";

interface IProps {
  data?: PositionFieldsFragment[];
  onStake?: (nftId: string | number) => Promise<any>;
}

export const PositionsTable: React.FC<IProps> = ({ data, onStake }) => {
  return (
    <TableContainer component={Paper} sx={{ minWidth: 700, maxWidth: 1200 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>NFT</TableCell>
            <TableCell>Liquidity</TableCell>
            <TableCell>Age</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <PositionRow
              key={row.id}
              {...row}
              onStake={() => onStake?.(row.id)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
