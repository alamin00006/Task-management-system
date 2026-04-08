"use client";

type Column<T> = {
  title: string;
  key: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
};

export default function DataTable<T>({ columns, data, loading }: Props<T>) {
  if (loading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-medium text-muted-foreground"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border bg-card">
          {data.map((row: any) => (
            <tr key={row.id} className="hover:bg-muted/50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
