import { ReactNode } from 'react';

type FilterToolbarProps = {
  filters: Array<{
    label: string;
    active?: boolean;
  }>;
  aside?: ReactNode;
};

export function FilterToolbar({ filters, aside }: FilterToolbarProps) {
  return (
    <div className="toolbar-row">
      <div className="chip-row">
        {filters.map((filter) => (
          <div key={filter.label} className={`filter-chip${filter.active ? ' is-active' : ''}`}>
            {filter.label}
          </div>
        ))}
      </div>
      {aside ?? null}
    </div>
  );
}
