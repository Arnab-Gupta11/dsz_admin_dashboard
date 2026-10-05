import { ITableProps } from '@/types/custom-table.types';

const CustomTable = <T extends object>({ columns, data }: ITableProps<T>) => {
  return (
    <div className="border-border bg-card custom-scrollbar overflow-x-auto rounded-md border p-0 shadow-xs">
      <table className="divide-border min-w-full divide-y">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50">
            {columns?.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="text-primary-text px-5 py-4 text-left text-sm font-semibold tracking-wider text-nowrap uppercase opacity-90"
              >
                {column?.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-border divide-y">
          {data?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
            >
              {columns?.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="text-secondary-text px-5 py-4 text-sm whitespace-nowrap"
                >
                  {'accessor' in column && column?.accessor
                    ? String(row[column?.accessor] ?? '')
                    : column?.cell?.(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
