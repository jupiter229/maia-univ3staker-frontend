// @ts-nocheck
import {
  BsArrowDownShort,
  BsArrowLeftShort,
  BsArrowRightShort,
  BsArrowUpShort,
} from "react-icons/bs";
import { usePagination, useSortBy, useTable } from "react-table";

interface IProps {
  data: any[];
  columns: any[];
}

export const Table: React.FC<IProps> = ({ columns, data }) => {
  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 5 } },
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex },
    page,
  } = tableInstance;

  return (
    <div className="bg-dark-hard rounded-xl p-4 text-white w-full">
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="w-full">
          <thead>
            {headerGroups.map((headerGroup, idx) => (
              <tr key={idx} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, idx) => (
                  <th
                    key={idx}
                    {...column.getHeaderProps(
                      !column.disabledSorting && column.getSortByToggleProps()
                    )}
                    id={`th_${column?.id}`}
                    className="px-4 py-2 text-left"
                  >
                    <div className="flex items-center gap-1 relative">
                      <div className="inline-block relative">
                        <span
                          className={`duration-200 inline-block ${
                            column.isSorted ? "-translate-x-[18px]" : ""
                          }`}
                        >
                          {column.render("Header")}
                        </span>
                        <span
                          className={`absolute top-1/2 -translate-y-1/2 -right-1 ${
                            column.isSorted
                              ? "opacity-100 pointer-events-auto"
                              : "opacity-0 pointer-events-none"
                          }`}
                        >
                          {column.isSortedDesc ? (
                            <BsArrowDownShort size={22} />
                          ) : (
                            <BsArrowUpShort size={22} />
                          )}
                        </span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row, idx) => {
              prepareRow(row);
              return (
                <tr
                  key={idx}
                  {...row.getRowProps()}
                  className="bg-dark-light/60"
                >
                  {row.cells.map((cell, idx) => {
                    return (
                      <td
                        key={idx}
                        {...cell.getCellProps()}
                        id={`td_${cell.column.id}`}
                        className="px-4 py-4 text-left"
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          {/* Apply the table body props */}
        </table>
      </div>

      <div className="space-x-1 flex justify-center items-center pb-3 mt-2">
        <button
          className="text-darkOrange disabled:text-dark/20 dark:disabled:text-white/40 p-1"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <BsArrowLeftShort size={24} />
        </button>

        <span className="text-sm text-dark/70 dark:text-white/70">
          Page {Math.min(pageIndex + 1, pageOptions.length)} of{" "}
          {pageOptions.length}
        </span>
        <button
          className="text-darkOrange disabled:text-dark/20 dark:disabled:text-white/40 p-1"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <BsArrowRightShort size={24} />
        </button>
      </div>
    </div>
  );
};
