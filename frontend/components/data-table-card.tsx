import { ReactNode } from 'react';

type DataTableColumn = {
  label: string;
};

type DataTableRow = {
  key: string;
  primary: ReactNode;
  cells: ReactNode[];
};

type DataTableCardProps = {
  columns: DataTableColumn[];
  rows: DataTableRow[];
};

export function DataTableCard({ columns, rows }: DataTableCardProps) {
  return (
    <div className="table-card" role="table" aria-label="Data Table">
      <div className="table-head" role="row">
        {columns.map((column) => (
          <span key={column.label} role="columnheader">{column.label}</span>
        ))}
      </div>
      <div className="table-list" role="rowgroup">
        {rows.map((row) => (
          <div key={row.key} className="table-grid" role="row">
            <div className="table-primary" role="cell">{row.primary}</div>
            {row.cells.map((cell, index) => (
              <div key={`${row.key}-${index}`} className="table-cell" role="cell">
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
