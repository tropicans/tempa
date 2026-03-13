import { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon ?? <Inbox size={24} />}
      </div>
      <strong>{title}</strong>
      {description && <p className="muted">{description}</p>}
      {action}
    </div>
  );
}
