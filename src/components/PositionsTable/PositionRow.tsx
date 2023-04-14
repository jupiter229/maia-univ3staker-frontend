import { PositionFieldsFragment } from "@/types";
import { formatBigNumber, formatDateDiff } from "@/utils";
import { TableCell, TableRow } from "@mui/material";

export const PositionRow: React.FC<
  PositionFieldsFragment & { onStake: () => any }
> = ({ onStake, ...data }) => {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {data.id}
      </TableCell>
      <TableCell>{formatBigNumber(data.liquidity)}</TableCell>
      <TableCell>{formatDateDiff(data.transaction.timestamp * 1000)}</TableCell>
      <TableCell>
        <button onClick={onStake}>Stake</button>
      </TableCell>
    </TableRow>
  );
};
